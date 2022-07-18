import "./prelude.js";

import fs from "fs";
import path from "path";

import express from "express";
import { graphqlHTTP } from "express-graphql";
import httpStatus from "http-status";

import * as middlewares from "./middlewares/index.js";
import config from "./config/index.js";
import { application } from "./application-info/index.js";
import { SchemaFromClient } from "./util/DiscordGraphQL/index.js";
import { client } from "./discord-bot.js";
import { morgan } from "./tool/index.js";
import { ApiError } from "./util/index.js";

const { error } = middlewares;
const { errorConverter, errorHandler } = error;

const logger = application(null, `Discord Bot Server`);

// GraphQL server
const app = express();

if (config.env !== `test`) {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}

const isProd = config.env === `production`;

client.on(`ready`, () => {
  if (client === null) return;
  logger.info(`Logged in as ${client.user?.tag}`);
});

const quotes = fs
  .readFileSync(
    path.join(process.cwd(), `/assets/content/text/quotes.txt`),
    `utf8`
  )
  .split(`\n`);

// Temporary test. Move to a separate discord bot framework later
client.on(`messageCreate`, message => {
  if (message.author.bot) return;
  if (message.content === `qotd`) {
    message.channel
      .send(quotes[Math.floor(Math.random() * quotes.length)])
      .catch(() => {});
  }
});

const gql = graphqlHTTP({
  schema: SchemaFromClient(client),
  graphiql: !isProd,
});

let mid;

if (isProd) {
  mid = gql;
} else {
  mid = (req, res, _) => {
    res.removeHeader(`Content-Security-Policy`);
    gql(req, res);
  };
}

app.use(`/graphql`, mid);

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, `Not found`));
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

const PORT = config.discord.gql.port;

if (!PORT) {
  logger.warn(`No port specified`);
}

logger.info(`Port: ${PORT}`);

const listener = app.listen(PORT, () => {
  logger.info(`App is on '${config.env}' mode`);
  if (!listener) throw new Error(`Server is null (for some reason idk)`);
  const addr = listener.address();
  if (!addr) throw new Error(`Address is null (for some reason idk)`);
  if (typeof addr === `string`)
    throw new Error(
      `Address was a string (why is this even allowed to happen in the place idk)`
    );
  const port = addr.port;
  logger.info(`Listening to port ${port} - http://localhost:${port}`);
});

process.on(`SIGTERM`, async () => {
  try {
    await listener.close();

    logger.info(`released resources`);
    process.exit(0);
  } catch {
    // do nothing. let the app crash
  }
});

export { app };
