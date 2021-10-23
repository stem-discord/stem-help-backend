const mongoose = require(`mongoose`);
const validator = require(`validator`);
const bcrypt = require(`bcryptjs`);
const { toJSON, paginate } = require(`./plugins`);
const { roles } = require(`../config/roles`);

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    user_id: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      validate(s) {
        // 1~32
        return !!s.match(/^[a-z_][a-z0-9_-]{0,31}/);
      },
    },
    email: {
      type: String,
      required: false,
      unique: false,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error(`Invalid email`);
        }
      },
    },
    password: {
      type: String,
      required: false,
      trim: true,
      minlength: 8,
      validate(value) {
        if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
          throw new Error(
            `Password must contain at least one letter and one number`,
          );
        }
      },
      private: true, // used by the toJSON plugin
    },
    roles: [{
      type: String,
      enum: roles,
      default: `user`,
    }],
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    // discord module
    discord: {
      access_token: {
        type: String,
        required: true,
      },
      token_type: {
        type: String,
        required: true,
      },
      expires_in: {
        type: Number,
        required: true,
      },
      refresh_token: {
        type: String,
        required: true,
      },
      scope: {
        type: String,
        required: true,
      },
      response_cache: {
        type: Object,
        required: true,
      },
    },
    
    // sessions: [{
    //   type: mongoose.Schema.Types.ObjectId,
    //   required: true,
    //   ref: `Session`,
    // }],
  },
  {
    timestamps: true,
  },
);

// add plugin that converts mongoose to json
userSchema.plugin(toJSON);
userSchema.plugin(paginate);

/**
 * Check if email is taken
 * @param {string} email - The user's email
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
userSchema.statics.isEmailTaken = async function (email, excludeUserId) {
  const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
  return !!user;
};

/**
 * Check if password matches the user's password
 * @param {string} password
 * @returns {Promise<boolean>}
 */
userSchema.methods.isPasswordMatch = async function (password) {
  const user = this;
  return bcrypt.compare(password, user.password);
};

userSchema.pre(`save`, async function (next) {
  const user = this;
  if (user.isModified(`password`)) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

module.exports = userSchema;
