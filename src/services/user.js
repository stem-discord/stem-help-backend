const httpStatus = require(`http-status`);

const { User } = require(`../shared`).mongo;

const { ApiError } = require(`../util`);

const getUserById = async (id) => {
  return User.findById(id);
};

module.exports = {
  getUserById,
};
