import * as models from "../models";

import * as connection from "../connection";
import { RequireProxy } from "./RequireProxy";

const mongo = new RequireProxy(() => connection.mongo.connection.isOperational(), {
  User: connection.mongo.model(`User`, models.User),
  Session: connection.mongo.model(`Session`, models.Session),
  Token: connection.mongo.model(`Token`, models.Token),
  Potd: connection.mongo.model(`Potd`, models.Potd),
});

const stem = new RequireProxy(() => connection.discord.connection.isOperational(), {
  get generalChannel() { return connection.discord.client.chanels.fetch(`839399426643591188`); },
});

const discord = new RequireProxy(connection.discord.isOperational, {
  stem,
});

export { mongo, discord };
