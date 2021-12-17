// Config loader

import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

import yargs from "yargs";
import dotenv from "dotenv";
import Joi from "joi";

import print from "../script/util/printJoiSchema.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const argv = yargs.option(`file`, {
  alias: `f`,
  describe: `config file to read`,
  type: `string`,
  default: `.env`,
}).argv;

const envPath = path.join(__dirname, argv.f);

const env = dotenv.parse(fs.readFileSync(envPath));

const schemaObj = {
  API_URL: Joi.string()
    .description(`API URL to connect to (client)`)
    .pattern(/^http/),
};

const schema = Joi.object().keys(schemaObj);

const { value: vars, error } = schema
  .prefs({ errors: { label: `key` } })
  .validate(env);

if (error) {
  /* eslint-disable no-console */
  console.log(
    `Invalid schema! Please refer to the table above. File: ${envPath}`
  );
  print(schema);
  throw error;
}

for (const k of Object.keys(schemaObj)) {
  process.env[k] = vars[k];
}

/**
 * .local is determined at runtime
 */
export default vars;
