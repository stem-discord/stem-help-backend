// Store arbitrary data

import mongoose from "mongoose";

import { toJSON } from "./plugins";

const data = mongoose.Schema({
  // storing only entries
  namespace: {
    type: String,
    required: false,
    unique: true,
    index: true,
  },
}, {
  timestamps: true,
  strict: false,
});

data.plugin(toJSON);

export default data;
