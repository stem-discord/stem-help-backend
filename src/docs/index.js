import fs from "fs";
import config from "../config/index.js";

import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const pack = JSON.parse(
  fs.readFileSync(path.join(__dirname, `../../package.json`))
);

const { version } = pack;

const swaggerDef = {
  openapi: `3.0.0`,
  info: {
    title: `stem.help backend API documentation`,
    version,
    license: {
      name: `MIT`,
      url: `https://github.com/stem-discord/stem-help-backend`,
    },
  },
  servers: [
    {
      url: `http://localhost:${config.port}/v1`,
    },
  ],
};

export default swaggerDef;
