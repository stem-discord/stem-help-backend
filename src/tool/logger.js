import path from "path";

import config from "../config/index.js";
import { default as winston } from "winston";
import { dirname, getCallerDir, time as t } from "../util/index.js";

const time = config.logging.absolute ? t.startTime : t.localeTime;

const moduleRoot = dirname(import.meta);
const srcRoot = dirname(import.meta, `../`);

const enumerateErrorFormat = winston.format(info => {
  if (info instanceof Error) {
    Object.assign(info, { message: info.stack });
  }
  return info;
});

function WinstonLogger(fmt) {
  return winston.createLogger({
    level: config.env === `development` ? `debug` : `info`,
    format: winston.format.combine(
      enumerateErrorFormat(),
      config.env === `development`
        ? winston.format.colorize()
        : winston.format.uncolorize(),
      winston.format.splat(),
      winston.format.printf(fmt)
    ),
    transports: [
      new winston.transports.Console({
        stderrLevels: [`error`],
      }),
    ],
  });
}

const logger = WinstonLogger(
  ({ level, message }) => `[⌚ ${time()}] ${level}: ${message}`
);

function Logger(name, printPath = false) {
  let pp = ``;
  if (printPath) {
    const absPath = getCallerDir(moduleRoot, 2);
    const paths = path.relative(srcRoot, path.dirname(absPath)).split(path.sep);
    paths.push(path.parse(absPath).name);
    pp = `▷ ${paths.join(`‣`)} `;
  }
  // I don't know if making a new winston logger every time is a good idea, but it works.
  return WinstonLogger(({ level, message }) => {
    const front = `[⌚ ${time()}] ${level}: [${name}] ${pp}`;
    if (message?.includes(`\n`)) {
      // Create newline and stuff
      const splits = message.split(`\n`);
      let longest = Math.max(...splits.map(v => v.length));
      longest = Math.max(0, longest - front.length + 15); // Have to account for posix color codes I think
      message = `─`.repeat(longest) + splits.map(v => `\n    │${v}`).join(``);
      return `${front}${message}`;
    }
    return `${front}: ${message}`;
  });
}

export { logger, Logger };
