import httpStatus from "http-status";
import fetch from "node-fetch";

import * as lib from "../../lib/index.js";

const { ApiError, catchAsync, pick } = lib.util;
const config = lib.config;

const router = lib.Router();

async function lookup(q) {
  const user = await lib.shared.discord.client.users.fetch(q);
  const member = await lib.shared.discord.stem.guild.members.fetch(q);
  return { ...user, stem: member };
}

router.get(
  `/:query`,
  catchAsync(async (req, res) => {
    const query = req.params.query;
    res.json(await lookup(query));
  })
);

router.get(`/`, (req, res) => {
  const query = req.query.query;
  if (!query) {
    throw new ApiError(httpStatus.BAD_REQUEST, `Missing query`);
  }
  res.json(lookup(query));
});

export default router;
