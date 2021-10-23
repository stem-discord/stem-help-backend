module.exports = function (config) {
  // poulate the config as well as validate
  // TODO: add joi validations (final)
  if (config.NODE_ENV === `production` && config.STATIC_SERVER) {
    throw new Error(`STATIC_SERVER must be set to false if NODE_ENV is production`);
  }
  if (config.NODE_ENV === `production` && config.STATIC_SERVER) {
    throw new Error(`STATIC_SERVER must be set to false if NODE_ENV is production`);
  }
  if (config.staticServer || config.staticServerPort || config.staticServerApiURL) {
    throw new Error(`staticServer, staticServerPort, and staticServerApiURL are in development`);
  }
// STATIC_SERVER: Joi.st
// STATIC_SERVER_PORT: J
// STATIC_SERVER_API_URL
};
