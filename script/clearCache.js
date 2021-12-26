import fs from "fs";
import { dirname } from "../src/util/index.js";

const cache = dirname(import.meta, `../.cache`);

if (fs.existsSync(cache)) {
  fs.rmSync(cache, { recursive: true });
  console.log(`cleared cache folder`);
} else {
  console.log(`.cache folder does not exist. Already cleared cache folder`);
}
