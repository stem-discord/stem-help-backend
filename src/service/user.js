const httpStatus = require(`http-status`);

const { User } = require(`../shared`).mongo;

const { ApiError } = require(`../util`);

const getUserById = async (id) => {
  return User.findById(id);
};

const createUser = User.create;

const discord = {
  getUserById: async (id) => {
    return User.findOne({ "discord.id": id });
  },
};

module.exports = {
  getUserById,
  createUser,
  discord,
};
