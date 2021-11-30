import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt";
import mongoose from "mongoose";

import config from "../../config";
import { Token } from "../../types";
import shared from "../../shared";

const jwtOptions = {
  secretOrKey: config.jwt.privatekey,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  algorithms: [`HS256`],
};

const jwtRefresh = async (payload, done) => {
  try {
    if (payload.type !== Token.REFRESH) {
      throw new Error(`Expected type '${Token.REFRESH}' got '${payload.type}'`);
    }
    const user = await shared.mongo.User.findById(payload.sub);
    if (!user) {
      throw new Error(`Deleted user`);
    }
    if (!user.sessions.include(payload.session)) {
      // This session was abandoned by the user.
      // therefore this refresh token is compromised
      // alert the user
      shared.mongo.Session.deleteOne({ _id: payload.session });
      shared.mongo.Token.deleteOne({ _id: payload.jti });
      throw new Error(`Refresh token is comproimsed. Log in again`);
    }
    const token = await shared.mongo.Token.findById(payload.jti);
    if (!token) {
      // user is providing a valid token that has a valid session but itself not valid
      // this refresh token is compromised. therefore, we should alert the user about this
      // and delete their current active refresh token and session
      user.sessions.filter(session => session !== payload.session);
      // user.markModified('sessions');
      user.save(); // might have parallel save issues. Deal with it after it happens
      shared.mongo.Session.deleteOne({ _id: payload.session });
      // maybe store a separate "compromised sessions"
      throw new Error(`Refresh token is compromised. Deleting session as well`);
    }
    user.session = mongoose.Types.ObjectId(payload.session);
    done(null, user);
  } catch (e) {
    done(e, false);
  }
};

const jwtAccessWithDB = async (payload, done) => {
  try {
    if (payload.type !== Token.ACCESS) {
      throw new Error(`Expected type '${Token.ACCESS}' got '${payload.type}'`);
    }
    const user = await shared.mongo.User.findById(payload.sub);
    done(null, user);
  } catch (e) {
    done(e, false);
  }
};

/**
 * Does not return the full user information. Only information in the jwt
 */
const jwtAccessWithoutDB = async (payload, done) => {
  try {
    if (payload.type !== Token.ACCESS) {
      throw new Error(`Expected type '${Token.ACCESS}' got '${payload.type}'`);
    }
    done(null, { ...payload.data, _id: payload.sub } );
  } catch (e) {
    done(e, false);
  }
};

const jwtRefreshStrategy = new JwtStrategy(jwtOptions, jwtRefresh);
const jwtAccessWithDBStrategy = new JwtStrategy(jwtOptions, jwtAccessWithDB);
const jwtAccessWithoutDBStrategy = new JwtStrategy(jwtOptions, jwtAccessWithoutDB);

export { jwtRefreshStrategy, jwtAccessWithDBStrategy, jwtAccessWithoutDBStrategy };
