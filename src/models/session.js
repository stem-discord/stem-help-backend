const mongoose = require(`mongoose`);

// Must be loaded first
const token = require(`./token`);

const { toJSON } = require(`./plugins`);

const sessionSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      default: () => `Session ` + `${Math.random()}`.substring(2),
    },
    tokens: [
      {
        type: token,
      },
    ],
    active: {
      type: token,
    },
  },
);

module.exports = sessionSchema;
