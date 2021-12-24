import madge from "madge";
import { sync } from "command-exists";

import { ApiError } from "../util/index.js";
import { promisify } from "util";
import svg2img from "svg2img";

const isGraphVizInstalled = sync(`gvpr`);

const validTypes = [`svg`, `png`];

async function generate(type = `svg`) {
  if (!isGraphVizInstalled)
    throw new ApiError(503, `GraphViz is not installed`);
  if (!validTypes.includes(type))
    throw new ApiError(400, `Invalid type. Must be one of ` + validTypes);

  if (type === `png`) {
    const svg = await generate(`svg`);
    return promisify(svg2img.bind(svg2img))(svg);
  }

  return madge(`src/index.js`).then(res => res[type]());
}

export { generate };
