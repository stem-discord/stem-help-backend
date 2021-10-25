const { Strategy: JwtStrategy, ExtractJwt } = require(`passport-jwt`);

const config = require(`../config`);
const { Token } = require(`../types`);
const { User } = require(`../models`);

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
      return done(null, false);
    }
    done(null, user);
  } catch (error) {
    done(error, false);
  }
};

const jwtStrategy = new JwtStrategy(jwtOptions, jwtVerify);

module.exports = {
  jwtStrategy,
};
