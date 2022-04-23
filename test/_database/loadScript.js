/**
 * =================================================================================
 *
 * This script drops the db and resets. It will only work if there is a .test.env file
 *
 * =================================================================================
 */

/* eslint-disable no-console */
import mongoose from "mongoose";
import yargs from "yargs";
import fs from "fs";
import dotenv from "dotenv";

import { dirname } from "../../src/util/index.js";

import database from "./index.js";

const argv = yargs.argv;

// Leave this filename as hard coded unless there is a really good reason
const envPath = dirname(import.meta, `../../.test.env`);

const exist = fs.existsSync(envPath);

if (!exist) console.warn(`${envPath} file is missing`);

const env = exist ? dotenv.parse(fs.readFileSync(envPath)) : {};

// This way the env variable cannot be passed by any other execution environment
// This variable MUST exist in the .test.env file
const uri = argv._[0] || env.MONGODB_URL;

if (!uri)
  throw new Error(`URI is required (either from arguments or .test.env)`);

if (!uri.match(/test/)) throw new Error(`cannot drop non-test database ${uri}`);

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on(`connected`, function () {
  console.log(`connected to MongoDB: ${uri}`);
  mongoose.connection.db.listCollections().toArray((err, names) => {
    const drops = [];
    names.forEach(function (e) {
      const d = mongoose.connection.db
        .dropCollection(e.name)
        .then(() => {
          console.info(`dropped collection ${e.name}`);
        })
        .catch(e => {
          console.error(`Error dropping collection ${e.name}`);
          console.error(e);
        });
      drops.push(d);
    });
    Promise.allSettled(drops).then(async () => {
      const creations = [];
      let i = 0;
      for (const [db, ctx] of Object.entries(database)) {
        const Collection = mongoose.model(
          `${i++}`,
          {
            name: String,
            username: String,
            hash: String,
            salt: String,
            roles: [],
          },
          db
        );
        let counter = 0;
        for (const item of ctx) {
          counter++;
          const c = Collection.create(item);
          creations.push(c);
        }
        console.log(`created ${counter} items in ${db}`);
      }
      await Promise.allSettled(creations);
      console.log(`finished creating, closing connection`);
      await mongoose.connection.close();
      console.log(`closed connection. Bye`);
    });
  });
});
