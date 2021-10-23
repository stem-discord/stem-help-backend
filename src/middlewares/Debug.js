const { logger } = require(`../tool`);
const { randomIdentifier } = require(`../util`);

// eslint-disable-next-line no-unused-vars
const log = (msg, a) => {
  if (a) {
    throw new Error(`Initialize the debug middleware ex) debug('msg')`);
  }
  if (!msg) {
    msg = randomIdentifier();
  }
  return(err, req, res, next) => {
    logger.debug(`DEBUG 🗿 ${msg} 🗿 `);
    next();
  };
};

module.exports = log;
