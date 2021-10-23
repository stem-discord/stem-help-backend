module.exports = {
  // templates
  Debug: require(`./Debug`),
  Validate: require(`./Validate`),

  // configured
  authorize: require(`./authorize`),
  error: require(`./error`),
  rateLimiter: require(`./rateLimiter`),
};
