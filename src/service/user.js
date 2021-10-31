import { mongo } from "../shared";
import { ApiError, crypto } from "../util";
import { jwt } from "../auth";

const create = (...arg) => mongo.User.create(...arg);

function ProxyFactory(path) {
  this.obj = {};
  let pathStr = path.join(`.`);
  if (pathStr === `id`) {
    pathStr = `_id`;
  }
  return new Proxy(async function (id) {
    return mongo.User.findOne({ [pathStr]: id });
  }, {
    get(target, key) {
      if (!this.obj[key]) this.obj[key] = new ProxyFactory([...path, key]);
      return this.obj[key];
    },
  });
}

function validatePassword(user, password) {
  return crypto.validatePassword(password, user.hash, user.salt);
}

const getBy = new ProxyFactory([]);

export { getBy, create, validatePassword };
