import shared from "../shared/index.js";

const getCount = () => {
  return shared.mongo.User.countDocuments({});
};

export { getCount };
