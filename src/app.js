const express = require(`express`);

const helmet = require(`helmet`);
const xss = require(`xss-clean`);
const mongoSanitize = require(`express-mongo-sanitize`);
const compression = require(`compression`);
const cors = require(`cors`);

const passport = require(`passport`);
const httpStatus = require(`http-status`);

const config = require(`./config`);
const {  morgan, Logger, passport:pass } = require(`./tool`);
const logger = Logger(`Express`);

const { jwtStrategy } = pass;
const { authLimiter, error } = require(`./middlewares`);
const { errorConverter, errorHandler } = error;

const { ApiError } = require(`./util`);

const routes = require(`./routes/v1`);
// const static = require(`./static/router`);

const app = express();

if (config.env !== `test`) {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}

// set security HTTP headers
app.use(helmet());

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// sanitize request data
app.use(xss());
app.use(mongoSanitize());

// gzip compression
app.use(compression());

// enable cors
if (config.env.cors) {
  app.use(cors());
  app.options(`*`, cors());
}

// jwt authentication
app.use(passport.initialize());
passport.use(`jwt`, jwtStrategy);

// limit repeated failed requests to auth endpoints
if (config.env === `production`) {
  app.use(`/v1/auth`, authLimiter);
}

// v1 api routes
app.use(`/v1`, routes);

if (config.staticRote) {
  // Static pages for testing
  const static = require(`./static`);
  app.use(`/static`, static);
  logger.info(`Static route loaded http://localhost:${config.port}/static`);
} else {
  logger.info(`Static route is not deployed`);
}

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, `Not found`));
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

module.exports = app;
