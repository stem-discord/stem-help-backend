const httpStatus = require(`http-status`);

const lib = require(`../../lib`);
const { Validate, redirect, ServePage } = lib.middlewares;
const { discord } = lib.validations;
const { pages } = lib;

const router = lib.Router();

router.get(`/discord`,
  Validate(discord.oauth.redirectUri),
  redirect,
  ServePage(pages.error.misconfiguration, `redirect link was not set`),
);

module.exports = router;
