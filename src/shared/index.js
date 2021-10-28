import { User as UserSchema } from "../models";

import connection from "../connection";
// eslint-disable-next-line no-unused-vars
const example = {
  syncValue: 1,
  asyncValue: new Promise(r => { setTimeout(r(true), 0); }),
};

const mongo = {
  User: connection.mongo.model(`User`, UserSchema),
};

const discord = {
  generalChannel: () => connection.discord.channels.fetch(`839399426643591188`),
};

export { mongo, discord };
