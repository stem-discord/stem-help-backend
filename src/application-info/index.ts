/** Basic initialization wrapper and configuration that main applications should be using
 */

import { git } from "../util/index.js";
import config from "../config/index.js";
const { status } = git;
import { Logger } from "../tool/index.js";

let configured = false;

export const application = (executor, name) => {
  executor ||= () => {};
  if (configured) throw new Error(`Application already configured`);
  configured = true;
  const logger = Logger(name);
  const unexpectedHandler = (title: string) => (error: Error) => {
    error.stack = title + error.stack;
    logger.error(error);
  };

  // Just run the executor
  (async () => executor())().catch(e => {
    logger.error(`Error in ${name}`, e);
  });

  process.on(`uncaughtException`, unexpectedHandler(`Unexpected Error`));
  process.on(`unhandledRejection`, unexpectedHandler(`Unexpected Rejection`));
  process.on(`warning`, warning => {
    if (warning.message.includes(`stream/web`)) return;
    logger.warn(warning.stack);
  });

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
    logger.info(
      `Node version: ${process.version}${process.arch}-${process.platform} mode: ${config.env}`
    );
  })();

  return logger;
};
