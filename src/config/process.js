export default (function (config) {
  // poulate the config as well as validate
  // TODO: add joi validations (final)
  if (config.NODE_ENV === `production` && config.STATIC_SERVER) {
    throw new Error(
      `STATIC_SERVER must be set to false if NODE_ENV is production`
    );
  }
  if (config.NODE_ENV === `production` && config.STATIC_SERVER) {
    throw new Error(
      `STATIC_SERVER must be set to false if NODE_ENV is production`
    );
  }
  if (config.staticServer || config.staticServerPort) {
    throw new Error(`staticServer, staticServerPort are in development`);
  }

  if (config.noConfig) {
    if (process.env.NODE_ENV === `production`) {
      throw new Error(`noConfig is not allowed in production`);
    }
    config.jwt.publicKey ??= `0`;
    config.jwt.privateKey ??= `0`;
  }
});
