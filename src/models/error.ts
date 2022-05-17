import { default as mongoose } from "mongoose";

// Stores errors
const errorSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      default: `No message provided`,
    },
    stack: {
      type: String,
      default: `No stack provided`,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    from: {
      type: String,
      default: `No logger provided`,
    },

    // TODO softcode expire after seconds to env variable
    createdAt: { type: Date, expires: `30d`, default: Date.now },
  },
  {
    timestamps: true,
  }
);

export default errorSchema;
