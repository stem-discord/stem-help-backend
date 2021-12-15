import httpStatus from "http-status";

import * as lib from "../../lib/index.js";

const config = lib.config;
const { discord } = lib.util;
const services = lib.service;

const { buildUri } = discord.oauth;
const { ApiError, catchAsync } = lib.util;
const { Validate } = lib.middlewares;

const router = lib.Router();

// // == DISCORD ==
// // returns the OAuth URI
// router.route(`/discord`)
//   .get((req, res) => {
//     const uri = config.discord.OAuthUri;
//     if (uri) {
//       return res.redirect(uri);
//     }
//     throw new ApiError(httpStatus.NOT_FOUND, `DISCORD_OAUTH_URI is not set`, true);
//   });

router.route(`/refresh`)
  .get((req, res) => {
  });

// standard password and
router.route(`/login`)
  .post(
    Validate(lib.validations.auth.register),
    catchAsync(async (req, res) => {
      const { username, password } = req.body;

      const user = await services.user.getBy.user_id(username);
      if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, `user not found`);
      }

      const isValid = await services.user.validatePassword(user, password);
      if (!isValid) {
        throw new ApiError(httpStatus.UNAUTHORIZED, `invalid password`);
      }

      const ip = req.headers[`x-forwarded-for`] || req.socket.remoteAddress;

      const tokenPair = await services.token.createSession(user, `session at ${ip}`);

      res.json(tokenPair);

    }));

router.route(`/register`)
  .post(
    Validate(lib.validations.auth.register),
    catchAsync(async (req, res) => {
      const { username, password } = req.body;

      let user = await services.user.getBy.user_id(username);
      if (user) {
        throw new ApiError(httpStatus.CONFLICT, `username already exists`);
      }

      const { salt, hash } = lib.util.crypto.generatePassword(password);
      const newUser = await services.user.create({ name: username, salt, hash, user_id: username });

      const ip = req.headers[`x-forwarded-for`] || req.socket.remoteAddress;

      const tokenPair = await services.token.createSession(newUser, `session at ${ip}`);

      res.json(tokenPair);
    }));

export default router;
