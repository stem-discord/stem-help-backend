import { mongo } from "../shared";
import { ApiError } from "../util";
import { jwt } from "../auth";

const createUser = (...arg) => mongo.User.create(...arg);

function ProxyFactory(path) {
  return new Proxy(async function (id) {
    path = path.join(`.`);
    if (path === `id`) {
      path = `_id`;
    }
    return mongo.User.findOne({ [path]: id });
  }, {
    get(target, key) {
      return new ProxyFactory([...path, key]);
    },
  });
}

const by = new ProxyFactory([]);

export { by };
export default by;
