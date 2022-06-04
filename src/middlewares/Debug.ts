import { logger } from "../tool/index.js";
import { randomIdentifier } from "../util/index.js";

// TODO: disable in production, add call line
// eslint-disable-next-line no-unused-vars
const log = (msg, a) => {
  if (a) {
    throw new Error(`Initialize the debug middleware ex) debug('msg')`);
  }
  if (!msg) {
    msg = randomIdentifier();
  }
  return (req, res, next) => {
    logger.info(`DEBUG 🗿 ${msg} 🗿 `);
    next();
  };
};

export default log;
