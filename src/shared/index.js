import * as models from "../models/index.js";

import * as connection from "../connection/index.js";
import { RequireProxy } from "./RequireProxy.js";

let model = Object.create(null);

const mongo = new RequireProxy(
  () => connection.mongo.connection.isOperational(),
  {
    get User() {
      return (model.user ??= connection.mongo.model(`User`, models.User));
    },
    // get Session() { return connection.mongo.model(`Session`, models.Session); },
    get Token() {
      return (model.token ??= connection.mongo.model(`Token`, models.Token));
    },
    get Potd() {
      return (model.potd ??= connection.mongo.model(`Potd`, models.Potd));
    },
    get Data() {
      // TODO: write an api for data
      return (model.data ??= connection.mongo.model(
        `Data`,
        models.Data,
        `data`
      ));
    },
  }
);

const stem = new RequireProxy(
  () => connection.discord.connection.isOperational(),
  {
    get guild() {
      return connection.discord.client.guilds.cache.get(`493173110799859713`);
    },
    get generalChannel() {
      return connection.discord.client.chanels.cache.get(`839399426643591188`);
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

export default { mongo, discord };
