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

  let w = config.discord.uploadWebhook;
  if (w) {
    const o = new URL(w);
    if (o.searchParams.get(`wait`) === null) {
      // Add ?wait=true
      o.searchParams.append(`wait`, `true`);
    }
    config.discord.uploadWebhook = o.toString();
  }

  w = config.discord.gql.url;
  if (w) {
    const o = new URL(w);
    config.discord.gql.port = Number(o.port);
  }

  w = config.mongoose.url;
  if (w) {
    const o = new URL(w);
    if (o.searchParams.get(`authSource`) === null) {
      o.searchParams.append(`authSource`, `admin`);
    }
    if (o.searchParams.get(`w`) === null) {
      o.searchParams.append(`w`, `1`);
    }
  }
});
