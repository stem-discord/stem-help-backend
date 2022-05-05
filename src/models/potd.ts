import mongoose from "mongoose";

import { toJSON } from "./plugins/index.js";

const potdSchema = new mongoose.Schema(
  {
    metadata: {
      author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: `User`,
        required: true,
      },
      contributors: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: `User`,
        default: [],
      },
      tags: {
        type: [String],
        default: [],
      },
      title: {
        type: String,
        required: true,
      },
      subject: {
        type: String,
        required: true,
      },
    },
    content: {
      question: {
        type: String,
        required: true,
      },
      answer: {
        type: String,
        required: true,
      },
      hint: {
        type: String,
        default: ``,
      },
      images: {
        type: [String],
        default: [],
      },
      explanation: {
        type: String,
        default: ``,
      },
    },
  },
  {
    timestamps: {
      createdAt: `metadata.createdTimestamp`,
      updatedAt: `metadata.lastEditTimestamp`,
    },
  }
);

// add plugin that converts mongoose to json
potdSchema.plugin(toJSON);
export default potdSchema;
