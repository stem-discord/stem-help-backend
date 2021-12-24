import madge from "madge";
import { sync } from "command-exists";

import { ApiError } from "../util/index.js";

const isGraphVizInstalled = sync(`gvpr`);

const validTypes = [`svg`];

async function generate(type = `svg`) {
  if (!isGraphVizInstalled)
    throw new ApiError(503, `GraphViz is not installed`);
  if (!validTypes.includes(type))
    throw new ApiError(400, `Invalid type. Must be one of ` + validTypes);
  return madge(`src/index.js`).then(res => res[type]());
}

export { generate };
