import path from "path";
import fs from "fs";
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const file = path.join(__dirname, `../test/.env`);
if (!fs.existsSync(file)) {
  // TODO softcode this
  // If you have a lot of time, just rewrite the entire setup thing
  fs.writeFileSync(file, `API_URL=http://localhost:${process.env.PORT}/v1`);
  console.log(`./test/.env file did not exist. generated one`);
}
