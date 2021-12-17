import httpStatus from "http-status";
import passport from "passport";

import * as lib from "../../lib/index.js";

const { jwtRefreshStrategy } = lib.auth.jwt;

const config = lib.config;
// const { discord } = lib.util;
const services = lib.service;

// const { buildUri } = discord.oauth;
const { ApiError, catchAsync } = lib.util;
// const { Validate } = lib.middlewares;

const router = lib.Router();

router.route(`/register`).post(
  catchAsync(async (req, res) => {
    const { username, password } = req.body;
    const name = req.body.name ?? username;

    if (!username || !password) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        `username and password are required`
      );
    }

    let user = await services.user.getBy.username(username);
    if (user) {
      throw new ApiError(httpStatus.CONFLICT, `username already exists`);
    }

    const { salt, hash } = lib.util.crypto.generatePassword(password);

    const newUser = await services.user.create({ name, salt, hash, username });

    // const ip = req.headers[`x-forwarded-for`] || req.socket.remoteAddress;

    const access_token = services.token.createAccessToken(newUser);
    const refresh_token = await services.token.createRefreshToken(newUser);

    res.json({
      access_token,
      refresh_token,
      user: newUser.toJSON(),
    });
  })
);

// standard password and
router.route(`/login`).post(
  catchAsync(async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        `username and password are required`
      );
    }

    const user = await services.user.getBy.username(username);
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, `user not found`);
    }

    const isValid = await services.user.validatePassword(user, password);
    if (!isValid) {
      throw new ApiError(httpStatus.UNAUTHORIZED, `invalid password`);
    }

    const access_token = services.token.createAccessToken(user);
    const refresh_token = await services.token.createRefreshToken(user);

    res.json({
      access_token,
      refresh_token,
      user: user.toJSON(),
    });
  })
);

/**
 * Protected route
 */
router
  .route(`/refresh`)
  .post(passport.authenticate(jwtRefreshStrategy), (req, res) => {
    res.json({
      access_token: services.token.createAccessToken(req.user),
    });
  });

export default router;
