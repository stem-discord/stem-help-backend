import passport from "passport";
import passportJwt from "passport-jwt";
import Joi from "Joi";

import config from "../../../config";
import service from "../../../service";

const { JwtStrategy, ExtractJwt } = passportJwt;
const { getUserById } = service.user;

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.jwt.secret,
  algorithms: [`RS256`],
};

const centuralizedStrategy = new JwtStrategy(options, function (jwt_payload, done) {
  getUserById({ _id: jwt_payload.sub }, (err, user) => {
    if (err) {
      return done(err, false);
    }
    if (user) {
      return done(null, user);
    } else {
      return done(null, false);
    }
  });
});

const optionsSchema = {
  expiration: Joi.number().custom((value, helpers) => {
    if (value < 0) {
      return helpers.message(`expiration in minutes`);
    }
    return value;
  }),
};
const DecenturalizedStrategy = (options) => new JwtStrategy(options, function (jwt_payload, done) {
  getUserById({ _id: jwt_payload.sub }, (err, user) => {
    if (err) {
      return done(err, false);
    }
    if (user) {
      return done(null, user);
    }
    else {
      return done(null, false);
    }
  });
});

const centuralized = passport.authenticate(hitDb);
const Decenturalized = options => passport.authenticate(DecenturalizedStrategy(options));
const decenturalized = passport.authenticate(DecenturalizedStrategy({}));


export { centuralized };
export { decenturalized };
export { Decenturalized };
