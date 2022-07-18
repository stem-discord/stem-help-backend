import "./prelude.js";

import app from "./app.js";
import config from "./config/index.js";

import * as connection from "./connection/index.js";

import { application } from "./application-info/index.js";
import { Server } from "http";

const logger = application(null, `API Server`);

let listeningCb;

const apiServer: Server & {
  ready?: Promise<unknown>;
} = app.listen(config.port, () => {
  logger.info(`App is on '${config.env}' mode`);
  logger.info(
    `Listening to port ${config.port} - http://localhost:${config.port}/v1/docs`
  );
  listeningCb(true);
});

apiServer.on(`error`, (err: Error & { code: string }) => {
  if (err?.code === `EADDRINUSE`) {
    logger.error(`Port ${config.port} is already in use`);
    listeningCb(false);
    process.emit(`SIGTERM`);
    return;
  }
  logger.error(err);
});

apiServer.ready = (async () => {
  await new Promise(r => {
    listeningCb = r;
  });
  if (config.connections) {
    logger.info(
      `connections option was set to [${config.connections.join(
        `, `
      )}], initializing these`
    );
  }
  await connection.openConnections(config.connections, [`discord`]);
  return true;
})();

let staticServer;

process.on(`SIGTERM`, async () => {
  logger.info(`Received SIGTERM, closing connections`);
  try {
    const sc = staticServer?.close;

    const funcs = [() => apiServer.close(), sc ? () => sc() : null];

    const promises: Promise<void>[] = [];
    for (const f of funcs) {
      if (f) {
        const p = f();
        promises.push(p);
      }
    }
    await Promise.all(promises);
    logger.info(`released resources`);
    process.exit(0);
  } catch {
    // do nothing. let the app crash
  }
});

export { apiServer };
