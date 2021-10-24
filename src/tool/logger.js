const path = require(`path`);

const winston = require(`winston`);

const config = require(`../config`);
const { time, getCallerDir } = require(`../util`);

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
    format: winston.format.combine(
      enumerateErrorFormat(),
      config.env === `development`
        ? winston.format.colorize()
        : winston.format.uncolorize(),
      winston.format.splat(),
      winston.format.printf(fmt),
    ),
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
    pp = `► ${paths.join(`/`)} `;
  }
  return WinstonLogger(({ level, message }) => `[⌚ ${time()}] ${level}: [${name}] ${pp}${message}`);
}

module.exports = { logger, Logger };
