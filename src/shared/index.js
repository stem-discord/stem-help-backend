import * as models from "../models/index.js";

import * as connection from "../connection/index.js";
import { RequireProxy } from "./RequireProxy.js";

import config from "../config/index.js";

let mongoModel = Object.create(null);

const mongo = new RequireProxy(
  () => connection.mongo.connection.isOperational(),
  {
    get User() {
      return (mongoModel.user ??= connection.mongo.mongooseConnection.model(
        `User`,
        models.User
      ));
    },
    get Token() {
      return (mongoModel.token ??= connection.mongo.mongooseConnection.model(
        `Token`,
        models.Token
      ));
    },
    get Potd() {
      return (mongoModel.potd ??= connection.mongo.mongooseConnection.model(
        `Potd`,
        models.Potd
      ));
    },
    get Data() {
      // TODO: write an api for data
      return (mongoModel.data ??= connection.mongo.mongooseConnection.model(
        `Data`,
        models.Data,
        `data`
      ));
    },
  }
);

const stemInformationModel = Object.create(null);

const stemInformation = new RequireProxy(
  () => connection.stemInformation.connection.isOperational(),
  {
    get ThankedLog() {
      return (stemInformationModel.user ??=
        connection.stemInformation.mongooseConnection.model(
          `ThankedLog`,
          models.AnySchema
        ));
    },
    get UserInfoPublic() {
      return (stemInformationModel.token ??=
        connection.stemInformation.mongooseConnection.model(
          `UserInfo`,
          models.AnySchema
        ));
    },
  }
);

const stem = new RequireProxy(
  () => connection.discord.connection.isOperational(),
  {
    get guild() {
      return connection.discord.client.guilds.cache.get(
        config.discord.server.stem
      );
    },
    get generalChannel() {
      return connection.discord.client.chanels.cache.get(
        config.discord.server.stem
      );
    },
  }
);

const discord = new RequireProxy(
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

export default { mongo, discord, stemInformation };
