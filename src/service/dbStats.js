import httpStatus from "http-status";

import { mongo } from "../shared";
import ApiError from "../utils/ApiError";

const { User } = mongo;

const getCount = async () => {
  return await User.countDocuments({});
};

export { getCount };
