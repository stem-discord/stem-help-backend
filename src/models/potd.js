import mongoose from "mongoose";

import { toJSON } from "./plugins";
import userUploadable from "./base/userUploadable.js";

const potdSchema = mongoose.Schema({
  ...userUploadable,
  question: {
    type: String,
    required: true,
  },
  answer: {
    type: String,
    required: true,
  },
  explanation: {
    type: String,
    required: false,
  },
  upvotes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: `User`,
    },
  ],
  downvotes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: `User`,
    },
  ],
  images: [
    {
      type: String,
    },
  ],
  // json metadata
  metadata: {
    type: String,
    required: true,
  },
});

// add plugin that converts mongoose to json
potdSchema.plugin(toJSON);
export default potdSchema;
