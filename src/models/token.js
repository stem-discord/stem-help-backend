import { default as mongoose } from "mongoose";
import User from "./user.js";

// stores the id of refresh tokens
const tokenSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: `User`,
    },
    valid: {
      type: Boolean,
      default: true,
    },
    breeched: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// TODO: softcode this
tokenSchema.index({}, { expireAfterSeconds: 60 * 60 * 24 * 7 });

export default tokenSchema;
