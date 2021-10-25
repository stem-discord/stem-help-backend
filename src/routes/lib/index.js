const util = require(`../../util`);

module.exports = {
  // standalones
  config: require(`../../config`),
  util,

  // utilization
  validations: require(`../../validations`),
  middlewares: require(`../../middlewares`),
  services: require(`../../service`),

  // easy access
  Router: require(`express`).Router,
  logger: util.logger,
  info: util.logger.info,
};
