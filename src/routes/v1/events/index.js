import httpStatus from "http-status";
import fetch from "node-fetch";
import Joi from "joi";

import * as lib from "../../lib/index.js";

const { ApiError, catchAsync, pick } = lib.util;
const config = lib.config;

const router = lib.Router();

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
    catchAsync(async (req, res) => {
      // Check for Discord token
      const { code_type, title, token: raw, hide } = req.body;

      const shouldHide = hide === `on`;

      let { source_code } = req.body;

      source_code = source_code.replace(/\r\n|\r\n/g, `\n`);

      if (source_code.length > (code_type === `java` ? 4000 : 2000)) {
        throw new ApiError(
          httpStatus.BAD_REQUEST,
          `source_code is too long. Max length is 2000. Recieved ${source_code.len} characters`
        );
      }

      if (!code_type || !source_code || !title || !raw) {
        throw new ApiError(
          httpStatus.BAD_REQUEST,
          `code_type, source_code, title, and token are required`
        );
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

      const stdout = execution?.run?.stdout;

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

      res.json({ message: `OK` });
    })
  )
  .get(
    catchAsync(async (req, res) => {
      let db = await lib.shared.mongo.Data.findOne({
        namespace: `christmastree`,
      });

      if (!db) {
        db = await lib.shared.mongo.Data.create({ namespace: `christmastree` });
      }

      const { trees } = db.toJSON().data;

      Object.values(trees).forEach(v => {
        {
          v.hide && (v.stdout = `[User has hidden this tree until vote]`);
        }
      });

      res.json({ trees });
    })
  );

export default router;
