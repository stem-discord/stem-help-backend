import { default as mongoose } from "mongoose";

import token from "./token.js";
import { toJSON } from "./plugins";

const sessionSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    default: () => `Session ` + `${Math.random()}`.substring(2),
  },
  tokens: [
    {
      type: token,
    },
  ],
  active: {
    type: token,
  },
});

export default sessionSchema;
