import mongoose from "mongoose";

const data = new mongoose.Schema(
  {},
  {
    timestamps: false,
    strict: false,
    minimize: false,
  }
);

export default data;
