// Store arbitrary data

import mongoose from "mongoose";

import { toJSON } from "./plugins";

const data = mongoose.Schema({
  // storing only entries

}, {
  timestamps: true,
});

data.plugin(toJSON);

export default data;
