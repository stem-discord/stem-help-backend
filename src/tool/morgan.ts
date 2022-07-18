import morgan from "morgan";

import config from "../config/index.js";
import { logger } from "./logger.js";

morgan.token(`message`, (req, res) => res.locals.errorMessage || ``);

// TODO: access.log append stream
const getIpFormat = () =>
  config.env === `production` ? `:remote-addr - ` : ``;

// I want to make this work but
// This just won't work for some reason
// morgan.token(`jbody`, function (req) {
//   if (req.headers[`content-type`] === `application/json`) {
//     return JSON.stringify(req.body);
//   }
//   return `non-json-body`;
// });

const successResponseFormat = `${getIpFormat()}:method :url :status - :response-time ms`;
const errorResponseFormat = `${getIpFormat()}:method :url :status - :response-time ms - message: :message`;

const successHandler = morgan(successResponseFormat, {
  skip: (req, res) => res.statusCode >= 400,
  stream: { write: message => logger.info(message.trim()) },
});

const errorHandler = morgan(errorResponseFormat, {
  skip: (req, res) => res.statusCode < 400,
  stream: { write: message => logger.error(message.trim()) },
});

export { successHandler, errorHandler };
