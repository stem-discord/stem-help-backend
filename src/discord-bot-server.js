import express from "express";
import { graphqlHTTP } from "express-graphql";
import { buildSchema } from "graphql";

import config from "./config/index.js";
import { application } from "./application-info/index.js";

const logger = application(null, `Discord Bot Server`);

// GraphQL server
const app = new express();

// The root provides a resolver function for each API endpoint
const root = {
  hello: () => {
    return `Hello world!`;
  },
};

// TODO Fill this later
const schema = buildSchema(`
type Query {
  hello: String
}
`);

const isProd = config.env === `production`;

const gql = graphqlHTTP({
  schema,
  rootValue: root,
  graphiql: !isProd,
});

let mid;

if (isProd) {
  mid = gql;
} else {
  mid = (req, res, next) => {
    res.removeHeader(`Content-Security-Policy`);
    gql(req, res, next);
  };
}

app.use(mid);

const PORT = config.discord.apiServer.port;

if (!PORT) {
  logger.warn(`No port specified`);
}

const listener = app.listen(PORT, () => {
  logger.info(`App is on '${config.env}' mode`);
  const port = listener.address().port;
  logger.info(`Listening to port ${port} - http://localhost:${port}`);
});

process.on(`SIGTERM`, async (code = 0) => {
  try {
    await app.close();

    logger.info(`released resources`);
    process.exit(code);
  } catch {
    // do nothing. let the app crash
  }
});

export { app };
