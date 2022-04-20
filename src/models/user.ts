import mongoose, { Schema } from "mongoose";
import Joi from "joi";

import * as field from "../validations/fields.js";

import { paginate, toJSON } from "./plugins/index.js";

import { Role, Group } from "../types/index.js";

import { pick } from "../util/index.js";

const userSchema: Schema & {
  roles?: string[]; // TODO figure this out later
} = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    username: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      validate(s) {
        // 1~32
        Joi.assert(s, Joi.string().custom(field.username));
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
      validate(s) {
        Joi.assert(s, Joi.string().custom(field.username));
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
    ranks: [
      {
        type: String,
        enum: Object.values(Role),
        access_token: true,
      },
    ],
    groups: [
      {
        type: String,
        enum: Object.values(Group),
        access_token: true,
      },
    ],
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    // sessions: [
    //   {
    //     type: Session,
    //   },
    // ],
    // // current session
    // session: {
    //   type: Session,
    // },
    // discord module
    discord: {},
    // id: {
    //   sparse: true,
    //   type: String,
    //   // required: true,
    //   unique: true,
    // },
    // access_token: {
    //   type: String,
    //   // required: true,
    // },
    // token_type: {
    //   type: String,
    //   // required: true,
    // },
    // expires_in: {
    //   type: Number,
    //   // required: true,
    // },
    // refresh_token: {
    //   type: String,
    //   // required: true,
    // },
    // // ??
    // scope: {
    //   type: String,
    //   // required: true,
    // },
    // response_cache: {
    //   type: Object,
    //   // required: true,
    // },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
userSchema.plugin(toJSON);
userSchema.plugin(paginate);

// TODO tbh i don't know how to write this method
// if you can write it in a cleaner way by using `access_token` please do
userSchema.methods.toAccessToken = function () {
  return {
    ...pick(this.toJSON(), [`ranks`, `groups`, `name`, `username`]),
  };
};

// userSchema.methods.hasRole = function (role) {
//   return this.roles.includes(role);
// };

// userSchema.methods.hasAnyRole = function (roles) {
//   return roles.some(role => this.hasRole(role));
// };

// userSchema.methods.hasAllRoles = function (roles) {
//   return roles.every(role => this.hasRole(role));
// };

// userSchema.methods.addRole = async function (role) {
//   if (!this.hasRole(role)) {
//     this.roles.push(role);
//     return await this.save();
//   }
//   return false;
// };

// userSchema.methods.removeRole = async function (role) {
//   if (this.hasRole(role)) {
//     this.roles = this.roles.filter(r => r !== role);
//     return await this.save();
//   }
//   return false;
// };

export default userSchema;
