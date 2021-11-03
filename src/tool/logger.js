import path from "path";
import { fileURLToPath } from 'url';

import config from "../config";
import { default as winston } from "winston";
import { getCallerDir, time as timeDefault, timeUtil } from "../util";

const { startTime } = timeUtil;

const time = config.logging.absolute ? startTime : timeDefault;

const { dirname } = path;
const __dirname = dirname(fileURLToPath(import.meta.url));

const moduleRoot = __dirname;
const srcRoot = path.join(__dirname, `../`);

const enumerateErrorFormat = winston.format((info) => {
  if (info instanceof Error) {
    Object.assign(info, { message: info.stack });
  }
  return info;
});

function WinstonLogger(fmt) {
  return winston.createLogger({
    level: config.env === `development` ? `debug` : `info`,
    format: winston.format.combine(enumerateErrorFormat(), config.env === `development`
      ? winston.format.colorize()
      : winston.format.uncolorize(), winston.format.splat(), winston.format.printf(fmt)),
    transports: [
      new winston.transports.Console({
        stderrLevels: [`error`],
      }),
    ],
  });
}

const logger = WinstonLogger(({ level, message }) => `[⌚ ${time()}] ${level}: ${message}`);

function Logger(name, printPath = false) {
  let pp = ``;
  if (printPath) {
    const absPath = getCallerDir(moduleRoot, 2);
    const paths = path.relative(srcRoot, path.dirname(absPath)).split(path.sep);
    paths.push(path.parse(absPath).name);
    pp = `▷ ${paths.join(`‣`)} `;
  }
  // I don't know if making a new winston logger every time is a good idea, but it works.
  return WinstonLogger(({ level, message }) => `[⌚ ${time()}] ${level}: [${name}] ${pp}: ${message}`);
}

export { logger, Logger };
