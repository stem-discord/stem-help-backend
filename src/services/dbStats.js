const httpStatus = require(`http-status`);

const { User } = require(`../shared`).mongo;

const ApiError = require(`../utils/ApiError`);

const getCount = async () => {
  return await User.countDocuments({});
};

module.exports = {
  getCount,
};
