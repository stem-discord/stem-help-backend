const passport = require(`passport`);

const { JwtStrategy, ExtractJwt } = require(`passport-jwt`);

const Joi = require('Joi');

const config = require(`../../../config`);

const { getUserById } = require(`../../../service`).user;

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.jwt.secret,
  algorithms: [`RS256`],
};

const centuralizedStrategy = new JwtStrategy(options, function(jwt_payload, done) {
  getUserById({_id: jwt_payload.sub }, (err, user) => {
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
  })
}

const DecenturalizedStrategy = (options) => new JwtStrategy(options, function(jwt_payload, done) {
  getUserById({_id: jwt_payload.sub }, (err, user) => {
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

const centuralized = passport.authenticate(hitDb);

const decenturalized = passport.authenticate(DecenturalizedStrategy({ }))

function DecenturalizedStrategy

module.exports = {
  centuralized,
  decenturalized,
  Decenturalized,
}