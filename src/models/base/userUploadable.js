import mongoose from "mongoose";

export default {
  author:{
    type: mongoose.Schema.Types.ObjectId,
    ref: `User`,
    required: true,
  },
  upload_date:{
    type: Date,
    default: Date.now,
  },
};
