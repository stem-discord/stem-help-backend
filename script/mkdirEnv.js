import fs from "fs";

import { dirname } from "../src/util/index.js";

const folderPath = dirname(import.meta, `../env`);
if (!fs.existsSync(folderPath)) {
  fs.mkdirSync(folderPath);
  console.log(`./env/ folder did not exist. generated one`);
}
