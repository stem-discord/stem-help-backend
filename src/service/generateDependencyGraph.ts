import madge from "madge";
import { sync } from "command-exists";

import { ApiError } from "../util/index.js";
import { promisify } from "util";
import svg2img from "svg2img";

import Jimp from "jimp";

const isGraphVizInstalled = sync(`gvpr`);

const validTypes = [`svg`, `png`];

const m = madge(`src/api-server.ts`, {
  includeNpm: true,
});

async function optimize(p, { type = `image/png`, width = 2000 } = {}) {
  return p.then(v =>
    Jimp.read(v)
      .then(lenna => lenna.resize(width, Jimp.AUTO).getBufferAsync(type))
      // TODO remove this catch clause after Jimp fixes https://github.com/oliver-moran/jimp/issues/1057
      .catch(e => {
        if (e instanceof Error) {
          throw e;
        }
        throw new Error(e);
      })
  );
}

async function generate(type = `svg`) {
  if (!isGraphVizInstalled)
    throw new ApiError(503, `GraphViz is not installed`);
  if (!validTypes.includes(type))
    throw new ApiError(400, `Invalid type. Must be one of ` + validTypes);

  if (type === `png`) {
    const svg = await generate(`svg`);
    return promisify(svg2img.bind(svg2img))(svg);
  } else if ([`jpeg`, `jpg`].includes(type)) {
    const svg = await generate(`svg`);
    return optimize(promisify(svg2img.bind(svg2img))(svg), {
      type: `image/jpeg`,
    });
  }
  return m.then(res => res[type]());
}

export { generate };
