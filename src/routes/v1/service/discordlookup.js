import httpStatus from "http-status";
import fetch from "node-fetch";

import * as lib from "../../lib/index.js";

const { ApiError, catchAsync, pick } = lib.util;
const config = lib.config;

const router = lib.Router();

router.get(`/:query`, (req, res) => {
  const query = req.params.query;
  const users = lib.service.discord.userResolveAnything(query);
  res.json(users.map(v => pick(v, [`id`, `username`, `discriminator`, `avatar`])));
});

export default router;
