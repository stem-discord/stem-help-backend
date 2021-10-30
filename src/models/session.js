import { default as mongoose } from "mongoose";

import Token from "./token";

const sessionSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    default: () => `Session ` + `${Math.random()}`.substring(2),
  },
  active: {
    type: Token,
  },
});

export default sessionSchema;
