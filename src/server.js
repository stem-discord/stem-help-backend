import app from "./app";
import config from "./config";

import * as connection from "./connection";

import { git } from "./util";
import { Logger } from "./tool";

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

const apiServer = app.listen(config.port, () => {
  logger.info(`App is on '${config.env}' mode`);
  logger.info(`Listening to port ${config.port} - http://localhost:${config.port}/v1/docs`);
});

apiServer.ready = (async () => {
  await new Promise(rr => { apiServer.on(`connect`, rr); });
  await connection.openConnections;
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

process.on(`SIGTERM`, async (code = 0) => {
  try {
    logger.info(`SIGTERM signal received`);

    const funcs = [
      apiServer.close,
      staticServer?.close,
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
