const mongoose = require(`mongoose`);
const app = require(`./app`);
const { config, logger } = require(`./config`);

let server;
mongoose.connect(config.mongoose.url, config.mongoose.options).then(() => {
  logger.info(`Connected to MongoDB`);
  server = app.listen(config.port, () => {
    logger.info(`Listening to port ${config.port} url: http://localhost:${config.port}/v1/docs`);
    logger.info(`App is on '${config.env}' mode`);
  });
});

const exitHandler = () => {
  if (server) {
    server.close(() => {
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
  if (server) {
    server.close();
  }
});
