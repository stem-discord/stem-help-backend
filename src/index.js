const app = require(`./app`);
const config = require(`./config`);
const { Logger } = require(`./tool`);
const logger = new Logger(`Index`);

logger.info(`Node version: ${process.version}${process.arch}-${process.platform}`);

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
  logger.info(`SIGTERM signal received`);
  const funcs = [
    apiServer.close,
    staticServer?.close,
  ];
  const promises = [];
  for (const f of funcs) {
    if (f) {
      let p = new Promise(r => f(r));
      promises.push(p);
    }
  }
  await Promise.all(promises);
  logger.info(`released resources`);
  process.exit(code);
});
