import * as lib from "../../lib/index.js";

const { ApiError, catchAsync, pick } = lib.util;
const config = lib.config;

const router = lib.Router();

const canvasCache = new lib.util.cache.FileSystemCache({
  basePath: `./.cache/canvas-cache`,
  transform: v => v,
  toBuffer: v => v,
  generator: text => lib.service.generatePngBanner.generate(text),
});

const htmlCache = new lib.util.cache.FileSystemCache({
  basePath: `./.cache/html-cache`,
  transform: v => v,
  toBuffer: v => v,
  generator: text =>
    lib.service.generatePngFromHtml.generate(`
        <div>
          <h1 id="text">${text}</h1>
        </div>`),
});

router.get(
  `/html/*`,
  catchAsync(async (req, res) => {
    const text = req.params[0].replace(/_/g, ` `);

    const buf = await htmlCache.get(text);

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

    const buf = await canvasCache.get(text);

    res.writeHead(200, {
      "Content-Type": `image/png`,
      "Content-Length": buf.length,
    });

    res.end(buf);
  })
);

export default router;
