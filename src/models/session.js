import { default as mongoose } from "mongoose";

import token from "./token.js";

const sessionSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    default: () => `Session ` + `${Math.random()}`.substring(2),
  },
  active: {
    type: token,
  },
});

export default sessionSchema;
