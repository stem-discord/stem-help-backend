module.exports = {
  // templates
  Debug: require(`./Debug`),
  Validate: require(`./Validate`),
  ServePage: require(`./ServePage`),

  // configured
  error: require(`./error`),
  rateLimiter: require(`./rateLimiter`),
  redirect: require(`./redirect`),
};
