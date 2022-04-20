import shared from "../shared/index.js";
import { ApiError, crypto, UsernameGenerator } from "../util/index.js";
import { jwt } from "../auth/index.js";
import { logger } from "../tool/index.js";

const create = (...arg) => shared.mongo.User.create(...arg);

function ProxyFactory(path) {
  const obj = {};
  let pathStr = path.join(`.`);
  if (pathStr === `id`) {
    pathStr = `_id`;
  }
  return new Proxy(
    async function (id) {
      return shared.mongo.User.findOne({ [pathStr]: id });
    },
    {
      get(target, key) {
        if (!obj[key]) obj[key] = ProxyFactory([...path, key]);
        return obj[key];
      },
    }
  );
}

function validatePassword(user, password) {
  return crypto.validatePassword(password, user.hash, user.salt);
}

const getBy = ProxyFactory([]);

async function getValidUsername(username) {
  // TODO: implement this with dp lookup getby.username
  const gen = UsernameGenerator(username);
  return gen.next().value;
}

export { getBy, create, validatePassword, getValidUsername };
