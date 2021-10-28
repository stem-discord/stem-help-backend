import fs from "fs";
import path from "path";
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export const misconfiguration = fs.readFileSync(path.join(__dirname, `./misconfiguration.ejs`), `utf8`);
