import httpStatus from "http-status";

import * as lib from "../../lib";

const config = lib.config;
const { discord } = lib.util;
const service = lib.service;

const { buildUri } = discord.oauth;
const { ApiError, catchAsync } = lib.util;

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
  });

router.route(`/refresh`)
  .get((req, res) => {
  });

// standard password and
router.route(`/login`)
  .post(catchAsync(async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
      throw new ApiError(httpStatus.BAD_REQUEST, `username and password are required`);
    }

    const user = await service.user.getBy.username(username);
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, `user not found`);
    }

    const isValid = await service.user.validatePassword(user, password);
    if (!isValid) {
      throw new ApiError(httpStatus.UNAUTHORIZED, `invalid password`);
    }

    const ip = req.headers[`x-forwarded-for`] || req.socket.remoteAddress;

    const tokenPair = await service.token.createSession(user, `session at ${ip}`);

    res.json(tokenPair);

  }));

router.route(`/register`)
  .post(catchAsync(async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
      throw new ApiError(httpStatus.BAD_REQUEST, `username and password are required`);
    }

    const user = await service.user.getBy.username(username);
    if (user) {
      throw new ApiError(httpStatus.CONFLICT, `username already exists`);
    }

    const newUser = await service.user.create(username, password);

    const ip = req.headers[`x-forwarded-for`] || req.socket.remoteAddress;

    const tokenPair = await service.token.createSession(newUser, `session at ${ip}`);

    res.json(tokenPair);
  }));

export default router;
