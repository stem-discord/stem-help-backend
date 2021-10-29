import { mongo } from "../shared";

const getCount = () => {
  return mongo.User.countDocuments({});
};

export { getCount };
