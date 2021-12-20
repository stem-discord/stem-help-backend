import fs from "fs";
import config from "../config/index.js";

import { dirname } from "../util/index.js";

const pack = JSON.parse(
  fs.readFileSync(dirname(import.meta, `../../package.json`))
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
