import docs from "./docs/index.js";
import data from "./data/index.js";
import service from "./service/index.js";
import status from "./status/index.js";
import events from "./events/index.js";

import * as lib from "../lib/index.js";

const router = new lib.Router();

router.use(`/docs`, docs);

router.use(`/data`, data);

router.use(`/service`, service);

router.use(`/status`, status);

router.use(`/events`, events);

export default router;

export * as docs from "./docs/index.js";
export * as data from "./data/index.js";
export * as service from "./service/index.js";
export * as status from "./status/index.js";
export * as events from "./events/index.js";
