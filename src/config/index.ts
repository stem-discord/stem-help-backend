import fs from "fs";
import dotenv from "dotenv";
import { dirname } from "../util/index.js";
import envLoader from "./envLoader.js";

import generateEnvConfig from "./env.js";
import type { Env } from "./env.js";
import argv from "./yargs.js";
import proc from "./process.js";

const envPath = dirname(
  import.meta,
  `../../${process.env.APPLICATION_ENV}${
    process.env.NODE_ENV === `test` ? `.test` : ``
  }.env`
);

console.log(`[src/config/index.js] Loading env ${envPath}`);

const conf = dotenv.parse(fs.readFileSync(envPath));

let config: Env =
  (conf.NO_CONFIG ?? process.env.NO_CONFIG) === `true`
    ? { ...process.env }
    : { ...process.env, ...conf };

for (const o of [envLoader(), argv]) {
  for (const [k, v] of Object.entries(o)) {
    if (v) config[k] = v;
  }
}
// generate proper config
config = generateEnvConfig(config);

// populate using yargs
Object.assign(config, argv);

// separate final validation logic
proc(config);

export default config;
export type { Env };
