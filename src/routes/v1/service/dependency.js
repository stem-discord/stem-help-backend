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

router.get(
  `/:type`,
  catchAsync(async (req, res) => {
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
