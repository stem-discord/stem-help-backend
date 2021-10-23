const { User: UserSchema } = require(`../models`);

// eslint-disable-next-line no-unused-vars
const example = {
  syncValue: 1,
  asyncValue: new Promise(r => setTimeout(r(true), 0)),
};

const mongo = {
  User: require(`../connection`).mongo.model(`User`, UserSchema),
};

const discord = {
  generalChannel: () => require(`../connection`).discord.channels.fetch(`839399426643591188`),
};

module.exports = {
  mongo,
  discord,
};
