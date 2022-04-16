import * as lib from "../../lib/index.js";

const { ApiError, catchAsync, pick } = lib.util;
const config = lib.config;
const { logger } = lib.tool;

const router = lib.Router();

const cache = new lib.util.cache.FileSystemCache({
  baseDir: `./.cache/dependency`,
  generator: t => lib.service.generateDependencyGraph.generate(t),
  toBuffer: b => b,
  transform: b => b,
});

const c = cache
  .clear()
  .catch(e => {
    logger.error(`Error while clearing cache`, e);
  })
  .finally(() => null);

router.get(
  `/:type`,
  catchAsync(async (req, res) => {
    await c;
    const type = req.params.type;

    const buf = await cache.get(type);

    res.writeHead(200, {
      "Content-Type": `image/${type}`,
      "Content-Length": buf.length,
    });

    res.end(buf);
  })
);

export default router;
