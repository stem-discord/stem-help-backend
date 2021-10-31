import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from 'url';
import envLoader from "./envLoader.js";

import env from "./env.js";
import argv from "./yargs.js";
import proc from "./process.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config({ path: path.join(__dirname, process.env.NODE_ENV === `test` ? `../../.test.env` : `../../.env`) });
let config = { ...process.env};

for (const o of [envLoader(), argv]) {
  for (const [k, v] of Object.entries(o)) {
    if (v) config[k] = v;
  }
}
// generate proper config
config = env(config);

// populate using yargs
// Object.assign(config, argv);

// separate final validation logic
proc(config);

export default config;
