import path from "path";
import dotenv from "dotenv";

import env from "./env.js";
import argv from "./yargs.js";
import proc from "./process.js";
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));


dotenv.config({ path: path.join(__dirname, `../../.env`) });
let config = { ...process.env };
// populate using yargs
Object.assign(config, argv);

// generate proper config
config = env(config);

// separate final validation logic
proc(config);

export default config;
