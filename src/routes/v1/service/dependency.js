import * as lib from "../../lib/index.js";

const { ApiError, catchAsync, pick } = lib.util;
const config = lib.config;

const router = lib.Router();

const cache = new lib.util.cache.FileSystemCache({
  ns: `dependency`,
  transformer: v => new Buffer.from(v.data),
});

router.get(
  `/:type`,
  catchAsync(async (req, res) => {
    const type = req.params.type;

    const buf =
      (await cache.get(type)) ??
      (await lib.service.generateDependencyGraph.generate(type));

    cache.set(type, buf);

    res.writeHead(200, {
      "Content-Type": `image/${type}`,
      "Content-Length": buf.length,
    });

    res.end(buf);
  })
);

export default router;
