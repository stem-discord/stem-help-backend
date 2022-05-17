/* eslint-disable @typescript-eslint/ban-ts-comment */
import config from "../../config/index.js";
import expressSession from "express-session";
import MongoDBStore from "connect-mongodb-session";

import { Connection, NullConnection, Namespace } from "../connection.js";

const ns = new Namespace(`Session DB`, `Currently using mongo`);

let connection: Connection | NullConnection;
let store: MongoDBStore.MongoDBStore | null;

if (config.mongoose.url) {
  let resolve, reject;
  const cstore = (store = new (MongoDBStore(expressSession))(
    {
      uri: config.mongoose.url,
      collection: `sessions`,
    },
    (err: Error) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    }
  ));
  const init = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });
  connection = new Connection({
    ...ns,
    init: () => {
      return init;
    },
    heartbeat: () => true,
    close: () => {
      cstore.client.close();
    },
  });
} else {
  store = null;
  connection = new NullConnection(ns, `config.mongoose.url is missing`);
}

const cwc: typeof connection & {
  store?: typeof store;
} = connection;

cwc.store = store;

export { cwc as connection, store };
