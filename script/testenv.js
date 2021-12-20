import fs from "fs";
import { dirname } from "../src/util/index.js";

const file = dirname(import.meta, `../test/.env`);
if (!fs.existsSync(file)) {
  // TODO softcode this
  // If you have a lot of time, just rewrite the entire setup thing
  if (!process.env.PORT)
    throw new Error(`Pass in a PORT environment variable!`);
  fs.writeFileSync(file, `API_URL=http://localhost:${process.env.PORT}/v1`);
  console.log(`./test/.env file did not exist. generated one`);
}
