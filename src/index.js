const app = require(`./app`);
const config = require(`./config`);
const { logger } = require(`./tool`);

const apiServer = app.listen(config.port, () => {
  logger.info(`App is on '${config.env}' mode`);
  logger.info(`Listening to port ${config.port} - http://localhost:${config.port}/v1/docs`);
});

let staticServer;

const exitHandler = () => {
  if (apiServer) {
    apiServer.close(() => {
      logger.info(`Server closed`);
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  logger.error(error);
  exitHandler();
};

process.on(`uncaughtException`, unexpectedErrorHandler);
process.on(`unhandledRejection`, unexpectedErrorHandler);

process.on(`SIGTERM`, () => {
  logger.info(`SIGTERM received`);
  apiServer.close();
  staticServer?.close();
});
