import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt";

import config from "../config";
import { Token } from "../types";
import { User } from "../models";

const jwtOptions = {
  secretOrKey: config.jwt.secret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  algorithms: [`RS256`],
};

const jwtVerify = async (payload, done) => {
  try {
    if (payload.type !== Token.ACCESS) {
      throw new Error(`Invalid token type`);
    }
    const user = await User.findById(payload.sub);
    if (!user) {
      done(null, false);
      return;
    }
    done(null, user);
  } catch (error) {
    done(error, false);
  }
};

const jwtStrategy = new JwtStrategy(jwtOptions, jwtVerify);

export { jwtStrategy };
