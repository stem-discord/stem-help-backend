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
  },
  {
    timestamps: true,
  }
);

// TODO softcode expire after seconds to env variable
errorSchema.index({ createdAt: 1 }, { expireAfterSeconds: 30 * 24 * 60 * 60 });

export default errorSchema;
