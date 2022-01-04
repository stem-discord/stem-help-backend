// Express
import express from "express";

import compression from "compression";
import cors from "cors";
import helmet from "helmet";
import passport from "passport";
import httpStatus from "http-status";
import bodyParser from "body-parser";
import multer from "multer";

import config from "./config/index.js";
import routes from "./routes/index.js";
import staticRoute from "./static/index.js";
import * as middlewares from "./middlewares/index.js";
import { ApiError, git } from "./util/index.js";
import { Logger, morgan } from "./tool/index.js";

const upload = multer();

const logger = Logger(`Express`);

const { authLimiter, error } = middlewares;
const { errorConverter, errorHandler } = error;

// const static = require(`./static/router`);

const app = express();

if (config.env !== `test`) {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}

// set security HTTP headers
app.use(helmet({ contentSecurityPolicy: false }));

// parse json request body
app.use(express.json());

// parse form data
app.use(bodyParser.json());

// for parsing application/xwww-
app.use(bodyParser.urlencoded({ extended: true }));
// form-urlencoded

// for parsing multipart/form-data
app.use(upload.array());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// gzip compression
app.use(compression());

// enable cors
if (config.cors) {
  app.use(cors());
}

let v;

app.get(`/`, async (req, res) => {
  v ??= git.status.getLastCommit();
  // eslint-disable-next-line require-atomic-updates
  v = await v;
  res.status(200).json({ message: `OK`, version: v });
});

// limit repeated failed requests to auth endpoints
if (config.env === `production`) {
  // TODO write auth limiter
  // app.use(`/v1/auth`, authLimiter);
}

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (obj, done) {
  done(null, obj);
});

// initialize passport object on every request
app.use(passport.initialize());

if (config.staticRoute) {
  // Static pages for testing
  app.use(`/static`, staticRoute);
  logger.info(`Static route loaded http://localhost:${config.port}/static`);
} else {
  logger.info(`Static route is not deployed`);
}

// api routes
app.use(`/`, routes);

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, `Not found`));
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

export default app;
export * as connection from "./connection/index.js";
