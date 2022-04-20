import express from "express";
import { graphqlHTTP } from "express-graphql";

import config from "./config/index.js";
import { application } from "./application-info/index.js";
import { SchemaFromClient } from "./util/DiscordGraphQL/index.js";
import { client } from "./discord-bot.js";

const logger = application(null, `Discord Bot Server`);

// GraphQL server
const app = express();

const isProd = config.env === `production`;

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

const PORT = config.discord.apiServer.port;

if (!PORT) {
  logger.warn(`No port specified`);
}

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
