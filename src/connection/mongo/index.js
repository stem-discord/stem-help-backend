const mongoose = require(`mongoose`);

const config = require(`../../config`);
const { logger } = require(`../../tool`);

const ph = `[Mongo]`;

const connection = mongoose.connect(config.mongoose.url, config.mongoose.options).then(() => {
  logger.info(`${ph} Connected to MongoDB`);
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
    const count = await m.count({});
    logger.info(`${ph} ${count} entries found`);
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
