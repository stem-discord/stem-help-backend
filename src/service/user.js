import httpStatus from "http-status";

import { mongo } from "../shared";
import { ApiError } from "../util";

const { User } = mongo.mongo;

const getUserById = async (id) => {
  return User.findById(id);
};

const createUser = User.create;

const discord = {
  getUserById: async (id) => {
    return User.findOne({ "discord.id": id });
  },
};

export { getUserById, createUser, discord };
