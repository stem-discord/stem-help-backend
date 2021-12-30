import mongoose from "mongoose";

const data = mongoose.Schema(
  {},
  {
    timestamps: false,
    strict: false,
    minimize: false,
  }
);

export default data;
