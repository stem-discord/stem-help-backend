import { default as mongoose } from "mongoose";

// stores the id of refresh tokens
const tokenSchema = mongoose.Schema({
  invalid: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

// TODO: softcode this
tokenSchema.index({}, { expireAfterSeconds: 60 * 60 * 24 * 7 });

export default tokenSchema;
