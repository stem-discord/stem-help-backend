import * as lib from "../../lib/index.js";

const { ApiError, catchAsync, pick } = lib.util;
const config = lib.config;
const { logger } = lib.tool;

const router = lib.Router();

const cache = new lib.util.cache.MemoryCache({
  ttl: `1h`,
});

router.get(
  `/:type`,
  catchAsync(async (req, res) => {
    const type = req.params.type;

    let buf = await cache.get(type);

    if (!buf) {
      buf = lib.service.generateDependencyGraph.generate(type);
      cache.set(type, buf);
      buf = await buf;
    }

    res.writeHead(200, {
      "Content-Type": `image/${type}`,
      "Content-Length": buf.length,
    });

    res.end(buf);
  })
);

export default router;
