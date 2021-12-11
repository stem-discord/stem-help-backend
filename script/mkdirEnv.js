import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const folderPath = path.join(__dirname, `../env`);
if (!fs.existsSync(folderPath)) {
  fs.mkdirSync(folderPath);
  console.log(`./env/ folder did not exist. generated one`);
}
