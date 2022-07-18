import httpStatus from "http-status";
import fetch from "node-fetch";

import * as lib from "../../lib/index.js";

const { ApiError, catchAsync, pick } = lib.util;
const config = lib.config;

const router = lib.Router();

async function lookup(q) {
  const { data } = await lib.shared.discordgql.query`
  query {
    guild(id: "${config.discord.server.stem}") {
      member(id: "${q}") {
        user {
          tag,
          displayAvatarURL
        }
      }
    }
  }`;

  return data.guild
    ? { ...data.guild.member.user, stem: data.guild.member }
    : { stem: {} };
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
