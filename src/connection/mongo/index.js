const mongoose = require(`mongoose`);

const config = require(`../../config`);
const { Logger } = require(`../../tool`);
const logger = new Logger(`MongoDB`, true);

const { sleep } = require(`../../util`).async;

const connection = mongoose.createConnection(config.mongoose.url, config.mongoose.options);

connection.then(() => {
  logger.info(`Connected to MongoDB ${config.mongoose.url}`);
}).catch(e => {
  logger.error(`Error connecting to MongoDB ${config.mongoose.url}`, e);
});

let dbOpen;

const open = new Promise(resolve => {
  dbOpen = resolve;
});

connection.on(`error`, e => {
  logger.error(`Error while connecting to database`, e);
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
    logger.info(`loading ${collectionName}...`);
    await open;
    const count = await m.countDocuments({});
    logger.info(`${count} entries found for ${collectionName}`);
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
