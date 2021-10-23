const mongoose = require(`mongoose`);

// Must be loaded first
const { Token } = require(`../types`);

const { toJSON } = require(`./plugins`);

const tokenSchema = mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
      index: true,
    },
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: `User`,
      required: true,
    },
    type: {
      type: String,
      enum: [
        Token.REFRESH,
        Token.RESET_PASSWORD,
        Token.VERIFY_EMAIL,
      ],
      required: true,
    },
    expires: {
      type: Date,
      required: true,
    },
    blacklisted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

// add plugin that converts mongoose to json
tokenSchema.plugin(toJSON);

module.exports = tokenSchema;
