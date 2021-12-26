import httpStatus from "http-status";
import fetch from "node-fetch";
import Joi from "joi";

import * as lib from "../../lib/index.js";

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

const tokenCheck = catchAsync(async (req, res, next) => {
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

router
  .route(`/christmastree`)
  .post(
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

      const { trees } = db.toJSON().data;

      filterTrees(trees);

      res.json({ trees });
    })
  );

router.route(`/christmastree/vote`).post(
  () => {
    throw new ApiError(
      httpStatus.SERVICE_UNAVAILABLE,
      `Cannot submit trees after event is over`
    );
  },
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

    const { trees: newTrees } = db.toJSON().data;

    filterTrees(newTrees, id);

    res.json({ message: `OK`, trees: newTrees });
  })
);

export default router;

export { tokenCheck, procTree };
