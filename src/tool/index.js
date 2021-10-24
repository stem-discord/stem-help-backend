const { logger, Logger } = require(`./logger.js`);

module.exports = {
  logger,
  Logger,
  passport: require(`./passport.js`),

  morgan: require(`./morgan.js`),
  roleManager: require(`./roleManager.js`),
};
