import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from 'url';
import envLoader from "./envLoader.js";

import env from "./env.js";
import argv from "./yargs.js";
import proc from "./process.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config({ path: path.join(__dirname, process.env.NODE_ENV === `test` ? `../../.test.env` : `../../.env`) });
let config = { ...process.env, ...envLoader(), ...argv };

// generate proper config
config = env(config);

// populate using yargs
// Object.assign(config, argv);

// separate final validation logic
proc(config);

console.log(config);

export default config;
