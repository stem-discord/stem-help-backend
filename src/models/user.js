import mongoose from "mongoose";
import validator from "validator";

import { paginate, toJSON } from "./plugins";

import { Role } from "../types";
import Session from "./session.js";

const userSchema = mongoose.Schema({
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
  info: {
    type: Object,
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
  hash: {
    type: String,
    required: false,
    private: true, // used by the toJSON plugin
  },
  salt: {
    type: String,
    required: false,
    private: true, // used by the toJSON plugin
  },
  roles: [{
    type: String,
    enum: Object.values(Role),
    default: `user`,
  }],
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
  sessions: [
    {
      type: Session,
    },
  ],
  // current session
  session: {
    type: Session,
  },
  // discord module
  discord: {
    id: {
      type: String,
      // required: true,
      unique: true,
    },
    access_token: {
      type: String,
      // required: true,
    },
    token_type: {
      type: String,
      // required: true,
    },
    expires_in: {
      type: Number,
      // required: true,
    },
    refresh_token: {
      type: String,
      // required: true,
    },
    // ??
    scope: {
      type: String,
      // required: true,
    },
    response_cache: {
      type: Object,
      // required: true,
    },
  },
}, {
  timestamps: true,
});

// add plugin that converts mongoose to json
userSchema.plugin(toJSON);
userSchema.plugin(paginate);

userSchema.methods.hasRole = function (role) {
  return this.roles.includes(role);
};

userSchema.methods.hasAnyRole = function (roles) {
  return roles.some((role) => this.hasRole(role));
};

userSchema.methods.hasAllRoles = function (roles) {
  return roles.every((role) => this.hasRole(role));
};

userSchema.methods.addRole = async function (role) {
  if (!this.hasRole(role)) {
    this.roles.push(role);
    return await this.save();
  }
  return false;
};

userSchema.methods.removeRole = async function (role) {
  if (this.hasRole(role)) {
    this.roles = this.roles.filter((r) => r !== role);
    return await this.save();
  }
  return false;
};

userSchema.static.createUniqueUsername = async function (username) {
  // Add numbers at the end of a string username until it is unique
  // TODO: implement this
  return username;
};

export default userSchema;
