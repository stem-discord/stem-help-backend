import httpStatus from "http-status";

import { ApiError  } from "../util";

function RequireProxy(validator, obj) {
  this.cache = {};
  const stack = new Error().stack;
  return new Proxy(obj, {
    get: function (target, name) {
      if (!Object.prototype.hasOwnProperty.call(target, name)) {
        throw new Error(`${name} is not a property`, stack);
      }
      // eslint-disable-next-line no-async-promise-executor
      return new Promise(async (resolve, reject) => {
        try {
          if (!await validator()) {
            reject(new ApiError(httpStatus.SERVICE_UNAVAILABLE, `Cannot access property ${name} because it is unavailable`));
          }
          if (!Object.prototype.hasOwnProperty.call(this.cache, name)) {
            this.cache[name] = await target[name];
          }
          resolve(this.cache[name]);
        } catch (e) {
          reject(new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `Unknown error`));
          e.stack += `\n\nInitialization stack` + stack.substring(stack.indexOf(`\n`, stack.indexOf(`\n`) + 1));
          throw e;
        }
      });
    },
  });
}

export { RequireProxy };
