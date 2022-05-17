import { graphqlHTTP } from "express-graphql";
import { buildSchema } from "graphql";

import * as lib from "../lib/index.js";

const router = lib.Router();

const schema = buildSchema(`
type Query {
  hello: String
}
`);

// The root provides a resolver function for each API endpoint
const root = {
  hello: () => {
    return `Hello world!`;
  },
};

const isProd = lib.config.env === `production`;

const gql = graphqlHTTP({
  schema,
  rootValue: root,
  graphiql: !isProd,
});

let mid;

if (isProd) {
  mid = gql;
} else {
  mid = (req, res, _next) => {
    res.removeHeader(`Content-Security-Policy`);
    gql(req, res);
  };
}

router.use(`/*`, mid);

export default router;

export { schema };
