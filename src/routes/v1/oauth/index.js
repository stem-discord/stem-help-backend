const httpStatus = require(`http-status`);

const lib = require(`../../lib`);

const config = lib.config;
const { discord } = lib.util;
const { urlBuilder } = discord.oauth;
const { ApiError } = lib.util;

const router = lib.Router();

// == DISCORD ==
// returns the OAuth URI
router.route(`/discord`)
  .get((req, res) => {
    const uri = config.discord.OAuthUri;
    if (uri) {
      return res.redirect(uri);
    }
    throw new ApiError(httpStatus.NOT_FOUND, `DISCORD_OAUTH_URI is not set`, true);
  },
  );

module.exports = router;
