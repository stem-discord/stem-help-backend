import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from 'url';

import env from "./env.js";
import argv from "./yargs.js";
import proc from "./process.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config({ path: path.join(__dirname, `../../.env`) });
let config = { ...process.env };
// populate using yargs
Object.assign(config, argv);

// generate proper config
config = env(config);

// separate final validation logic
proc(config);

export default config;
