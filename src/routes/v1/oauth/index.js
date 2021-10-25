const express = require(`express`);

const lib = require(`../../lib`);

const { config } = lib.config;
const { discord } = lib.util;
const { urlBuilder } = discord.oauth;

const { ApiError } = lib.util;
const httpStatus = require(`http-status`);

const router = express.Router();


// returns the OAuth URI
router.route(`/discord`)
  .get((req, res) => {
    if (config.DISCORD_OAUTH_URI) {
      return res.redirect(
        config.DISCORD_OAUTH_URI,
      );
    }
    throw new ApiError(httpStatus.NOT_FOUND, `DISCORD_OAUTH_URI is not set`, true);
  },
  );

module.exports = router;
