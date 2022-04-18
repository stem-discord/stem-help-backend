import httpStatus from "http-status";
import fetch from "node-fetch";
import Joi from "joi";
import mutler from "multer";
import * as lib from "../../lib/index.js";
import userSchema from "../../../models/user.js";
import { async } from "../../../util/index.js";

const upload = mutler();
const { ApiError, catchAsync, pick } = lib.util;
const config = lib.config;

const router = lib.Router();

function filterTrees(trees, id) {
  Object.entries(trees).forEach(([k, v]) => {
    if (k !== id && v.hide) {
      // v.stdout = `[User has hidden this tree until vote]`;
      // v.title = `[User has hidden tree title until vote]`;
    }
  });
}

function filterGeneric(trees, id, material, fields) {
  Object.entries(trees).forEach(([k, v]) => {
    if (k !== id && v.hide) {
      for (const f of fields) {
        v[f] = `User has hidden ${material} [${f}] until vote`;
      }
    }
  });
}

const tokenCheck = catchAsync(async (req, res, next) => {
  if (req.body.skipToken && process.env.NODE_ENV === `development`)
    return void next();

  const { token: raw } = req.body;

  if (!raw) {
    throw new ApiError(httpStatus.BAD_REQUEST, `missing token`);
  }

  const [id, token] = raw.split(`_`);

  if (!token) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `token must be in the format of <id>_<token>`
    );
  }

  const entry = lib.service.discord.tokens[id];

  if (token !== entry) {
    throw new ApiError(httpStatus.UNAUTHORIZED, `Invalid token`);
  }

  req.body.id = id;

  next();
});

const procTree = catchAsync(async (req, res) => {
  // Check for Discord token
  const { code_type, title, hide, token } = req.body;

  const shouldHide = hide === `on`;

  let { source_code } = req.body;

  const id = req.body.id || token.split(`_`)[0];

  source_code = source_code.replace(/\r\n|\r\n/g, `\n`);

  if (source_code.length > (code_type === `java` ? 4000 : 2000)) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `source_code is too long. Max length is 2000. Recieved ${source_code.len} characters`
    );
  }

  // do some logic
  let db = await lib.shared.mongo.Data.findOne({
    namespace: `christmastree`,
  });

  if (!db) {
    db = await lib.shared.mongo.Data.create({ namespace: `christmastree` });
  }

  db.data.trees ??= {};
  db.data.codes ??= {};

  const execution = await lib.service.piston.client.execute(
    code_type,
    source_code
  );

  if (!execution.run) {
    throw new ApiError(httpStatus.BAD_REQUEST, JSON.stringify(execution));
  }

  if (execution.run.code !== 0) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `Code exited with non-zero code. Error:\n` + execution.run.stderr
    );
  }

  const stdout = execution?.run?.stdout?.replace(
    // eslint-disable-next-line no-control-regex
    /(?:\u001B\[\\d+;\\d+m)+/g,
    ``
  );

  if (!stdout) {
    throw new ApiError(httpStatus.BAD_REQUEST, `No stdout`);
  }

  if ((stdout.match(/\n/g)?.length ?? 0) > 100) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `stdout is too long. Please limit to 100 lines`
    );
  }

  if (stdout.length > 4000) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `Output is too long. Max 4000 characters.`
    );
  }

  db.data.trees[id] = {
    title,
    stdout,
    hide: shouldHide,
    votes: {
      // [user_id]: <1|0|-1>
    },
  };

  db.data.codes[id] = {
    code_type,
    source_code,
  };

  db.markModified(`data.trees.${id}`);
  db.markModified(`data.codes.${id}`);

  await db.save();

  const { trees, codes } = db.toJSON().data;

  filterTrees(trees, id);

  res.json({ message: `OK`, trees: trees, codes });
});

function cannotPost() {
  throw new ApiError(
    httpStatus.SERVICE_UNAVAILABLE,
    `Cannot submit trees after event is over`
  );
}

router
  .route(`/christmastree`)
  .post(
    cannotPost,
    lib.middlewares.Validate({
      body: Joi.object().keys({
        code_type: Joi.string().required(),
        source_code: Joi.string().required(), // using .max() was causing issues
        title: Joi.string().required(),
        token: Joi.string().required(),
        hide: Joi.string(),
      }),
    }),
    tokenCheck,
    procTree
  )
  .get(
    catchAsync(async (req, res) => {
      let db = await lib.shared.mongo.Data.findOne({
        namespace: `christmastree`,
      });

      if (!db) {
        db = await lib.shared.mongo.Data.create({
          namespace: `christmastree`,
          data: { trees: {}, codes: {} },
        });
      }

      const { trees, codes } = db.toJSON().data;

      filterTrees(trees);

      res.json({ trees, codes });
    })
  );

router.route(`/christmastree/vote`).post(
  tokenCheck,
  catchAsync(async (req, res) => {
    const { votes, token } = req.body;

    const id = req.body.id || token.split(`_`)[0];

    let db = await lib.shared.mongo.Data.findOne({
      namespace: `christmastree`,
    });

    if (!db) {
      db = await lib.shared.mongo.Data.create({
        namespace: `christmastree`,
        data: { trees: {}, codes: {} },
      });
    }

    for (const [u_id, v] of Object.entries(votes)) {
      if (v === 0) {
        delete db.data.trees[u_id].votes[id];
        continue;
      }

      db.data.trees[u_id].votes[id] = v;
    }

    db.markModified(`data.trees`);

    await db.save();

    const { trees: newTrees, codes } = db.toJSON().data;

    filterTrees(newTrees, id);

    res.json({ message: `OK`, trees: newTrees, codes });
  })
);

async function fetchNamespacedDB(namespace, fields = {}) {
  // do some logic
  let db =
    (await lib.shared.mongo.Data.findOne({ namespace })) ||
    (await lib.shared.mongo.Data.create({ namespace, data: fields }));

  Object.keys(fields).forEach(k => {
    db.markModified(`data.${k}`);
  });

  return db;
}

const procPoem = catchAsync(async (req, res) => {
  // Check for Discord token
  const { title, poem, token, hide } = req.body;

  const id = req.body.id || token.split(`_`)[0];

  // Word limit
  let l;
  if ((l = poem.trim().split(/\s+/).length) > 150) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `poem is too long. Max length is 150 words. Recieved ${l} words`
    );
  }

  const db = await fetchNamespacedDB(`poem`, { poems: {} });

  db.data.poems ??= {};

  db.data.poems[id] = {
    title,
    poem,
    hide: hide === `on`,
    votes: {
      // [user_id]: <1|0|-1>
    },
  };

  db.markModified(`data.poems.${id}`);

  await db.save();

  const { poems } = db.toJSON().data;

  // filterGeneric(poems, id, `poem`, [`title`, `poem`]);

  res.json({ message: `OK`, poems });
});

router
  .route(`/poem`)
  .post(
    cannotPost,
    lib.middlewares.Validate({
      body: Joi.object().keys({
        poem: Joi.string().required(),
        title: Joi.string().required(),
        token: Joi.string().required(),
        hide: Joi.string(),
      }),
    }),
    tokenCheck,
    procPoem
  )
  .get(
    tokenCheck,
    catchAsync(async (req, res) => {
      const db = await fetchNamespacedDB(`poem`, { poems: {} });

      const { poems } = db.toJSON().data;

      res.json({ poems });
    })
  );

router.route(`/poem/vote`).post(
  tokenCheck,
  catchAsync(async (req, res) => {
    const { votes, token } = req.body;

    const id = req.body.id || token.split(`_`)[0];

    let db = await fetchNamespacedDB(`poem`, { poems: {} });

    for (const [u_id, v] of Object.entries(votes)) {
      if (v === 0) {
        delete db.data.poems[u_id].votes[id];
        continue;
      }

      db.data.poems[u_id].votes[id] = v;
    }

    db.markModified(`data.poems`);

    await db.save();

    const { poems: newPoems } = db.toJSON().data;

    res.json({ message: `OK`, poems: newPoems });
  })
);

router.post(
  `/talent-show`,
  upload.array(`TalentShowFiles`),
  tokenCheck,
  catchAsync(async (req, res) => {
    const { title, text, token } = req.body;

    const id = req.body.id || token.split(`_`)[0];
    const files = req.files;

    let fileLinks = [];
    // check if files are available
    if (!files) {
      return void res.status(400).send({
        status: false,
        data: `No file is selected.`,
      });
    } else {
      fileLinks = await Promise.all(
        files.map(file => lib.service.discord.uploadFile(file))
      );
    }

    const db = await fetchNamespacedDB(`TalentShow`, { entries: {} });

    db.data.entries ??= {};

    db.data.entries[id] = {
      title,
      text,
      attachments: fileLinks,
    };

    db.markModified(`data.entries.${id}`);

    await db.save();

    const { entries } = db.toJSON().data;

    res.json({ message: `OK`, entries });
  })
);

router.get(
  `/talent-show`,
  catchAsync(async (req, res, next) => {
    const db = await fetchNamespacedDB(`TalentShow`, { entries: {} });

    const { entries } = db.toJSON().data;

    res.json({ entries });
  })
);
export default router;

export { tokenCheck, procTree };
