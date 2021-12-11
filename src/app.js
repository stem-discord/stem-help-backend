// Express
import express from "express";

import compression from "compression";
import cors from "cors";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import xss from "xss-clean";
import passport from "passport";
import httpStatus from "http-status";
import bodyParser from "body-parser";
import multer from "multer";

import config from "./config";
import routes from "./routes/v1";
import staticRoute from "./static";
import * as middlewares from "./middlewares";
import { ApiError, git } from "./util";
import { Logger, morgan } from "./tool";

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
app.use(helmet());

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

app.get(`/`, async (req, res) => {
  res.status(200).json({ message: `OK`, version: await git.status.getLastCommit() });
});

// limit repeated failed requests to auth endpoints
if (config.env === `production`) {
  app.use(`/v1/auth`, authLimiter);
}

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

// initialize passport object on every request
app.use(passport.initialize());

// v1 api routes
app.use(`/v1`, routes);

if (config.staticRoute) {
  // Static pages for testing
  app.use(`/static`, staticRoute);
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

export default app;
export * as connection from "./connection";
