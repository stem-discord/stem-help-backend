import httpStatus from "http-status";
import fetch from "node-fetch";

import * as lib from "../../lib/index.js";

const { ApiError, catchAsync, pick } = lib.util;
const config = lib.config;

const router = lib.Router();

function lookup(q) {
  const users = lib.service.discord.userResolveAnything(q);

  return users.map(v => {
    const u = pick(v, [`id`, `username`, `discriminator`, `avatar`]);
    u.nickname = u.member?.nickname;
    return u;
  });
}

router.get(`/:query`, (req, res) => {
  const query = req.params.query;
  res.json(lookup(query));
});

router.get(`/`, (req, res) => {
  const query = req.query.query;
  if (!query) {
    throw new ApiError(httpStatus.BAD_REQUEST, `Missing query`);
  }
  res.json(lookup(query));
});

export default router;
