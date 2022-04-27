import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt";

import config from "../../config/index.js";
import { Token } from "../../types/index.js";
import shared from "../../shared/index.js";

const jwtOptions = {
  secretOrKey: config.jwt.privateKey,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  algorithms: [`HS256`],
};

/**
 * A passport authentication method
 */
const jwtAccessStrategy = new JwtStrategy(jwtOptions, async (payload, done) => {
  if (payload.type !== Token.ACCESS) {
    return done(new Error(`Expected token type 'ACCESS'`), false);
  }
  try {
    const user = await shared.mongo.User.findById(payload.sub);
    if (user) {
      return done(null, user);
    }
    return done(null, false);
  } catch (err) {
    return done(err, false);
  }
});

/**
 * Extract from body refresh_token instead of header
 */
const jwtRefreshStrategy = new JwtStrategy(
  {
    ...jwtOptions,
    jwtFromRequest: ExtractJwt.fromBodyField(`refresh_token`),
  },
  async (payload, done) => {
    if (payload.type !== Token.REFRESH) {
      return done(new Error(`Expected token type 'REFRESH'`), false);
    }
    try {
      const user = await shared.mongo.User.findById(payload.sub);
      if (user) {
        return done(null, user);
      }
      return done(null, false);
    } catch (err) {
      return done(err, false);
    }
  }
);

export { jwtAccessStrategy, jwtRefreshStrategy };
