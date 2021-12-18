import * as lib from "../../lib/index.js";

const { ApiError, catchAsync, pick } = lib.util;
const config = lib.config;

const router = lib.Router();

const canvasCache = new lib.util.cache.NodeCache({
  stdTTL: 600,
  checkperiod: 60,
  useClones: false,
});

const htmlCache = new lib.util.cache.NodeCache({
  stdTTL: 600,
  checkperiod: 60,
  useClones: false,
});

router.get(
  `/html/*`,
  catchAsync(async (req, res) => {
    const text = req.params[0].replace(/_/g, ` `);

    const buf =
      htmlCache.get(text) ??
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
      canvasCache.get(text) ??
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
