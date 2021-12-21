import * as lib from "../../lib/index.js";

const { ApiError, catchAsync, pick } = lib.util;
const config = lib.config;

const router = lib.Router();

const canvasCache = new lib.util.cache.FileSystemCache({
  ns: `canvas-cache`,
  transformer: v => new Buffer.from(v.data),
});

const htmlCache = new lib.util.cache.FileSystemCache({
  ns: `html-cache`,
  transformer: v => new Buffer.from(v.data),
});

router.get(
  `/html/*`,
  catchAsync(async (req, res) => {
    const text = req.params[0].replace(/_/g, ` `);

    const buf =
      (await htmlCache.get(text)) ??
      (await lib.service.generatePngFromHtml.generate(text));
    htmlCache.set(text, buf);

    res.writeHead(200, {
      "Content-Type": `image/png`,
      "Content-Length": buf.length,
    });

    res.end(buf);
  })
);

router.get(
  `/canvas/*`,
  catchAsync(async (req, res) => {
    const text = req.params[0].replace(/_/g, ` `);

    const buf =
      (await canvasCache.get(text)) ??
      (await lib.service.generatePngBanner.generate(text));
    canvasCache.set(text, buf);

    res.writeHead(200, {
      "Content-Type": `image/png`,
      "Content-Length": buf.length,
    });

    res.end(buf);
  })
);

export default router;
