import Discord from "discord.js";
import { Model } from "mongoose";

import * as models from "../models/index.js";

import * as connection from "../connection/index.js";
import { RequireProxy } from "./RequireProxy.js";

import config from "../config/index.js";

const mongoModel = Object.create(null);

const mongo = RequireProxy(() => connection.mongo.connection.isOperational(), {
  get Error(): Model<typeof models.Error> {
    return (mongoModel.error ??= connection.mongo.connection.mongoose.model(
      `Error`,
      models.Error
    ));
  },
  get User(): Model<typeof models.User> {
    return (mongoModel.user ??= connection.mongo.connection.mongoose.model(
      `User`,
      models.User
    ));
  },
  get Potd(): Model<typeof models.Potd> {
    return (mongoModel.potd ??= connection.mongo.connection.mongoose.model(
      `Potd`,
      models.Potd
    ));
  },
  get Data(): Model<typeof models.Data> {
    // TODO: write an api for data
    return (mongoModel.data ??= connection.mongo.connection.mongoose.model(
      `Data`,
      models.Data,
      `data`
    ));
  },
});

const stemInformationModel = Object.create(null);

const stemInformation = RequireProxy(
  () => connection.stemInformation.connection.isOperational(),
  {
    get ThankedLog(): Model<typeof models.AnySchema> {
      return (stemInformationModel.user ??=
        connection.stemInformation.connection.mongoose.model(
          `ThankedLog`,
          models.AnySchema
        ));
    },
    get UserInfoPublic(): Model<typeof models.AnySchema> {
      return (stemInformationModel.token ??=
        connection.stemInformation.connection.mongoose.model(
          `UserInfo`,
          models.AnySchema
        ));
    },
  }
);

const stem = RequireProxy(() => connection.discord.connection.isOperational(), {
  get guild(): Discord.Guild | undefined {
    return connection.discord.client.guilds.cache.get(
      config.discord.server.stem
    );
  },
  get generalChannel(): Discord.TextChannel | undefined {
    return connection.discord.client.channels.cache.get(
      config.discord.server.general
      // TODO add runtime type checks
    ) as Discord.TextChannel;
  },
});

const discord = RequireProxy(
  () => connection.discord.connection.isOperational(),
  {
    get client() {
      return connection.discord.client;
    },
    get stem() {
      return stem;
    },
  }
);

const discordgql = RequireProxy(
  () => connection.discordgql.connection.isOperational(),
  {
    get query() {
      return connection.discordgql.query;
    },
  }
);

export default { mongo, discord, discordgql, stemInformation };
