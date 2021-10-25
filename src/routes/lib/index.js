module.exports = {
  // standalones
  config: require(`../../config`),
  util: require(`../../util`),

  Router: require(`express`).Router,

  // utilization
  validations: require(`../../validations`),
  middlewares: require(`../../middlewares`),
  services: require(`../../service`),
};
