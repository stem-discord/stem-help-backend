import { mongo } from "../shared";
import { ApiError } from "../util";

const getUserById = async (id) => {
  return mongo.User.findById(id);
};

const createUser = (...arg) => mongo.User.create(...arg);

const discord = {
  getUserById: async (id) => {
    return mongo.User.findOne({ "discord.id": id });
  },
};

export { getUserById, createUser, discord };
