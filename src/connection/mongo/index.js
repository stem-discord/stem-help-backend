const mongoose = require(`mongoose`);

const config = require(`../../config`);
const { logger } = require(`../../tool`);

const {sleep} = require(`../../util`).async;

const ph = `[Mongo]`;

const connection = mongoose.createConnection(config.mongoose.url, config.mongoose.options);

connection.then(() => {
  logger.info(`${ph} Connected to MongoDB ${config.mongoose.url}`);
}).catch(e => {
  logger.error(`${ph} Error connecting to MongoDB ${config.mongoose.url}`, e);
});

let dbOpen;

const open = new Promise(resolve => {
  dbOpen = resolve;
});

connection.on(`error`, e => {
  logger.error(`${ph} MongoDB connection error`, e);
});

connection.on(`open`, () => {
  dbOpen();
});


const model = (dbName, schema, plural) => {
  const m = connection.model(dbName, schema, plural);
  (async () => {
    let collectionName;
    if (plural) {
      collectionName = `collection ${plural} with schema ${dbName}`;
    } else {
      collectionName = `collection of '${dbName}'s`;
    }
    logger.info(`${ph} loading ${collectionName}...`);
    await open;
    const count = await m.countDocuments({});
    logger.info(`${ph} ${count} entries found for ${collectionName}`);
  })().catch(logger.error);
  return m;
};

const getConnection = () => connection;

if (config.mongoose.url) {
  model.enabled = true;
  getConnection.enabled = true;
}

module.exports = {
  model,
  getConnection,
};
