import * as lib from "../../lib/index.js";

const { ApiError, catchAsync, pick } = lib.util;
const config = lib.config;

const router = lib.Router();

router.get(`/html/*`, catchAsync(async (req, res) => {
  const text = req.params[0].replace(/_/g, ` `);

  const buf = await lib.service.generatePngFromHtml.generate(text);

  res.writeHead(200, {
    'Content-Type': `image/png`,
    'Content-Length': buf.length,
  });

  res.end(buf);
}));

router.get(`/canvas/*`, catchAsync(async (req, res) => {
  const text = req.params[0].replace(/_/g, ` `);

  const buf = await lib.service.generatePngBanner.generate(text);

  res.writeHead(200, {
    'Content-Type': `image/png`,
    'Content-Length': buf.length,
  });

  res.end(buf);
}));


export default router;
