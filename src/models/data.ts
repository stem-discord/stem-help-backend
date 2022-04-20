// Store arbitrary data

import mongoose from "mongoose";

import { toJSON } from "./plugins/index.js";

const data = new mongoose.Schema(
  {
    // storing only entries
    namespace: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    data: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
    strict: false,
    minimize: false,
  }
);

data.plugin(toJSON);

export default data;
