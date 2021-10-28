import app from "./app.js";
import config from "./config";
import { Logger } from "./tool";
import { git } from "./util";
const { status } = git;

const logger = new Logger(`Index`);

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
  logger.info(`Node version: ${process.version}${process.arch}-${process.platform} mode: ${config.env}`);
})();

const apiServer = app.listen(config.port, () => {
  logger.info(`App is on '${config.env}' mode`);
  logger.info(`Listening to port ${config.port} - http://localhost:${config.port}/v1/docs`);
});

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
