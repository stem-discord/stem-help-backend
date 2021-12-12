import * as lib from "../../lib/index.js";

const { ApiError, catchAsync, pick } = lib.util;
const config = lib.config;

const router = lib.Router();

const { generate } = lib.service.generatePngFromHtml;

router.get(`/*`, catchAsync(async (req, res) => {
  const text = req.params[0].replace(/_/g, ` `);

  const buf = await generate(text);

  res.writeHead(200, {
    'Content-Type': `image/png`,
    'Content-Length': buf.length,
  });

  res.end(buf);
}));


export default router;
