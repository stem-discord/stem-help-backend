import config from "../../config/index.js";

import fetch from "node-fetch";

import { Connection, NullConnection, Namespace } from "../connection.js";

const ns = new Namespace(
  `STEM Shield`,
  `Interactions with STEM Shield (currently only supports heartbeats)`
);
const logger = ns.logger;

let connection: Connection;

if (config.stemShield.heartbeatUrl) {
  logger.info(
    `STEM Shield heartbeat configured to ${(
      config.stemShield.heartbeatUrl as string
    ).replace(/[\da-f]{30,}/, m => `*`.repeat(m.length))}`
  );

  const heartbeat = async () => {
    const res = await fetch(config.stemShield.heartbeatUrl, {
      method: `POST`,
    }).catch(() => {
      throw new Error(`Cannot reach server`);
    });
    if (!res.ok) {
      throw new Error(`Connection is up, but the status is ${res.status}`);
    }
  };

  connection = new Connection({
    ...ns,
    init: () => {},
    heartbeat,
    close: () => {
      // No close for this type of connection
    },
  });
} else {
  connection = new NullConnection(
    ns,
    `config.stemInformation.heartbeatUrl is missing`
  );
}

export { connection };
