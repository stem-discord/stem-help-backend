import chai from "chai";
import { request, response } from "express";
import { ApiError } from "../../src/util/index.js";

function generateError(msg, error) {
  if (!error) throw new Error(`generateError() requires an error`);
  const e = Error(msg);
  e.stack += `\n\n====== stack =====\n` + error.stack;
  throw e;
}

/**
 * Checks if next has been called
 * @param {Function} mid middleware
 * @param {Object|Function} req if it is an object, a shallow 1 key level merge will happen. If it is an object, the request object reference will be passed to the middleware.
 * @param {Object} opts Check out function
 */
function middleware(mid, req, opts = {}) {
  let shouldReject = false;
  let message;

  const p = new Promise((resolve, reject) => {
    const {
      json: jsonValidator,
      send: sendValidator,
      next: nextValidator,
    } = opts;

    const reqObj = Object.create(request);

    reqObj.body = {};
    reqObj.headers = {};

    const resObj = Object.create(response);

    if (req !== undefined) {
      if (typeof req === `object`) {
        Object.assign(reqObj, req);
      } else if (typeof req === `function`) {
        req(resObj);
      } else {
        throw new Error(`req must be an object or a function`);
      }
    }

    const mapper = (prop, func) => {
      resObj[prop] = (obj, o) => {
        if (o !== undefined) {
          throw new Error(`res.json(obj, o) is not supported`);
        }

        if (func !== undefined) {
          let r = func(obj);
          if (r !== undefined) {
            throw new Error(`validator for '${prop}' failed`, r);
          }
        }

        return resObj[prop];
      };
    };

    mapper(`json`, jsonValidator);
    mapper(`send`, sendValidator);

    const nextSpy = chai.spy();

    const nextArgs = [];

    const next = (...args) => {
      if (args.length > 1) {
        throw new Error(`next() can only take one argument`);
      }
      nextSpy(...args);
      nextArgs.push(args?.[0]);
    };

    // If mid is synchronous, there wont be a .then
    (async () => mid(reqObj, resObj, next))()
      .then(() => {
        // Check if it has been called once
        expect(nextSpy).to.have.been.called.once();

        if (nextValidator) {
          let r = nextValidator(...nextArgs);
          if (r !== undefined) {
            throw new Error(`nextValidator failed`, r);
          }
        }

        const error = nextArgs[0];

        if (error) {
          if (shouldReject) {
            if (error instanceof ApiError) {
              if (message) expect(error.message).to.match(message);
            } else if (error instanceof Error) {
              generateError(
                `Middelware should throw an ApiError, not ${typeof error}`,
                error
              );
            } else {
              generateError(
                `Middelware should throw an ApiError, not a non-error ${typeof error}`,
                error
              );
            }
          } else {
            throw new Error(`Middleware threw an error in next()`);
          }
        }
      })
      .then(resolve)
      .catch(reject);
  });

  p.next = m => {
    shouldReject = m !== undefined;
    message = m;
    return p;
  };

  return p;
}

export { middleware };
