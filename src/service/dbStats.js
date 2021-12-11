import { mongo } from "../shared/index.js";

const getCount = () => {
  return mongo.User.countDocuments({});
};

export { getCount };
