import mongoose from "mongoose";

import config from "../../config";
import { Connection, NullConnection, Namespace } from "../connection";
import { async } from "../../util";

const { sleep } = async;

const ns = new Namespace(`MongoDB`, `Database connection with mongodb`);
const logger = ns.logger;

let connection;
let mongooseConnection;
let model;

if (config.mongoose.url) {
  const conn = mongoose.createConnection(config.mongoose.url, config.mongoose.options);

  conn.then(() => {
    logger.info(`Connected to MongoDB ${config.mongoose.url}`);
  }).catch(e => {
    logger.error(`Error connecting to MongoDB ${config.mongoose.url}`, e);
  });

  let dbOpen;

  const open = new Promise(resolve => {
    dbOpen = resolve;
  });

  conn.on(`error`, e => {
    logger.error(`Error while connecting to database`, e);
  });

  conn.on(`open`, () => {
    dbOpen();
  });

  model = (dbName, schema, plural) => {
    const m = conn.model(dbName, schema, plural);
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
  connection = new Connection({
    ...ns,
    init: open,
    // TODO: fix this
    heartbeat: () => true,
  });
} else {
  connection = new NullConnection(ns, `config.mongoose.url is missing`);
}

export { connection, mongooseConnection, model };
