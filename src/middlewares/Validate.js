import Joi from "joi";
import httpStatus from "http-status";
import util from "util";

import { ApiError, pick } from "../util/index.js";

const validate = schema => {
  const validSchema = pick(schema, [`params`, `query`, `body`]);
  const keys = Object.keys(validSchema);

  if (keys.length === 0) {
    throw new Error(
      `Schema was empty or didn't have params, query, body, ${util.format(
        schema
      )}`
    );
  }

  const comp = Joi.compile(validSchema);

  return (req, res, next) => {
    const object = pick(req, keys);
    const { value, error } = comp
      .prefs({ errors: { label: `key` }, abortEarly: false })
      .validate(object);

    if (error) {
      const errorMessage = error.details
        .map(details => details.message)
        .join(`, `);
      return next(new ApiError(httpStatus.BAD_REQUEST, errorMessage));
    }
    Object.assign(req, value);
    return next();
  };
};

export default validate;
