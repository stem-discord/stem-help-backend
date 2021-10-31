import httpStatus from "http-status";

import { ApiError  } from "../util";

function RequireProxy(validator, obj) {
  const cache = {};
  const stack = new Error().stack;
  return new Proxy(obj, {
    get: function (target, name) {
      if (!Object.prototype.hasOwnProperty.call(target, name)) {
        throw new Error(`${name} is not a property`, stack);
      }
      // eslint-disable-next-line no-async-promise-executor
      try {
        if (!validator()) {
          throw new ApiError(httpStatus.SERVICE_UNAVAILABLE, `Cannot access property ${name} because it is unavailable`);
        }
        if (!Object.prototype.hasOwnProperty.call(cache, name)) {
          cache[name] = target[name];
        }
        return cache[name];
      } catch (e) {
        e.stack += `\n\nInitialization stack` + stack.substring(stack.indexOf(`\n`, stack.indexOf(`\n`) + 1));
        throw e;
      }
    },
  });
}

export { RequireProxy };
