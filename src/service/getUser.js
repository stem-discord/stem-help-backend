import { mongo } from "../shared";
import { ApiError } from "../util";
import { jwt } from "../auth";

const createUser = (...arg) => mongo.User.create(...arg);

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

const by = new ProxyFactory([]);

export { by };
export default by;
