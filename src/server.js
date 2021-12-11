import app from "./app.js";
import config from "./config/index.js";

import * as connection from "./connection/index.js";

import { git } from "./util/index.js";
import { Logger } from "./tool/index.js";

const { status } = git;
const logger = new Logger(`Server`);

logger.info(`Finished importing modules`);

// Log
(async () => {
  const o = {
    branch: await status.getBranch(),
    commit: await status.getLastCommit(),
  };
  const diff = {
    head: await status.getHeadDiff(),
    unstaged: await status.getUnstagedDiff(),
  };
  const l = [`Git Info: \nBranch ${o.branch}#${o.commit}`];
  const diffs = [
    [`Unstaged diff`, diff.unstaged],
    [`Head diff`, diff.head],
  ];
  for (const [title, val] of diffs) {
    if (val) {
      l.push(`[${title}]\n${val}`);
    }
  }
  logger.info(l.join(`\n\n`));
  if (l.length <= 1) {
    logger.info(`working directory is in sync`);
  }
  logger.info(`Node version: ${process.version}${process.arch}-${process.platform} mode: ${config.env}`);
})();

let listeningCb;

const apiServer = app.listen(config.port, () => {
  logger.info(`App is on '${config.env}' mode`);
  logger.info(`Listening to port ${config.port} - http://localhost:${config.port}/v1/docs`);
  listeningCb(true);
});

apiServer.ready = (async () => {
  await new Promise(r => { listeningCb = r; });
  await connection.openConnections();
  return true;
})();

let staticServer;

const exitHandler = () => {
  process.emit(`SIGTERM`, 1);
};

const unexpectedErrorHandler = (error) => {
  logger.error(error);
  exitHandler();
};

process.on(`uncaughtException`, unexpectedErrorHandler);
process.on(`unhandledRejection`, unexpectedErrorHandler);

process.on(`warning`, (warning) => {
  if (warning.message.includes(`stream/web`)) return;
  logger.warn(warning.stack);
});

process.on(`SIGTERM`, async (code = 0) => {
  try {
    logger.info(`SIGTERM signal received`);


    const sc = staticServer?.close;

    const funcs = [
      () => apiServer.close(),
      sc ? () => sc() : null,
    ];

    const promises = [];
    for (const f of funcs) {
      if (f) {
        let p = f();
        promises.push(p);
      }
    }
    await Promise.all(promises);
    logger.info(`released resources`);
    process.exit(code);
  } catch {
    // do nothing. let the app crash
  }
});

export { apiServer };
