import ejs from "ejs";

import * as lib from "../../lib/index.js";

const { ApiError, catchAsync, pick } = lib.util;
const config = lib.config;

const router = lib.Router();

const profileBannerCache = new lib.util.cache.MemoryCache();

/**
 * EXPERIMENTAL
 */
router.get(
  `/:id`,
  catchAsync(async (req, res) => {
    const id = req.params.id;

    let buf = await profileBannerCache.get(id);

    if (!buf) {
      buf = lib.service.generatePngFromHtml.generateUrl(
        `${config.frontend.url}/component/user/${id}`,
        {
          deviceScaleFactor: 2,
        }
      );
      profileBannerCache.set(id, buf);
      buf = await buf;
    }

    res.writeHead(200, {
      "Content-Type": `image/png`,
      "Content-Length": buf.length,
    });

    res.end(buf);
  })
);

export default router;
