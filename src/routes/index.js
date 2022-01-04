import * as lib from "./lib/index.js";

import { default as v1 } from "./v1/index.js";

import { default as graphql } from "./graphql/index.js";

const routes = {
  v1,
};

const router = new lib.Router();

// Register routes
for (const [k, v] of Object.entries(routes)) {
  router.use(`/${k}`, v);
}

router.use(`/graphql`, graphql);

export default router;

export { v1 };
