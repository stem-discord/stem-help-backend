const mongoose = require(`mongoose`);

const config = require(`../../config`);
const { logger } = require(`../../tool`);

const ph = `[Mongo]`;

const connection = mongoose.connect(config.mongoose.url, config.mongoose.options).then(() => {
  logger.info(`${ph} Connected to MongoDB`);
});

const model = (dbName, schema, plural) => {
  // FIXME: create some sort of initializer for these stuff. actually, just fix the entire connection api later
  const m = mongoose.model(dbName, schema, plural);
  (async () => {
    let collectionName;
    if (plural) {
      collectionName = `collection ${plural} with schema ${dbName}`;
    } else {
      collectionName = `collection of '${dbName}'s`;
    }
    logger.info(`${ph} loading ${collectionName}...`);
    const count = await m.countDocuments({});
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
