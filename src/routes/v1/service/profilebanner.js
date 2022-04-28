import ejs from "ejs";

import * as lib from "../../lib/index.js";

const { ApiError, catchAsync, pick } = lib.util;
const config = lib.config;

const router = lib.Router();

const profileBannerCache = new lib.util.cache.FileSystemCache({
  basePath: `./.cache/profile-banner-cache`,
  transform: v => v,
  ttl: `60s`,
  toBuffer: v => v,
  generator: async id => {
    if (!id) return null;
    if (!id.match(/\d+/)) return null;
    return lib.service.generatePngFromHtml.generateUrl(
      `${config.frontend.url}/component/user/${id}`
    );
  },
});

/**
 * EXPERIMENTAL
 */
router.get(
  `/:id`,
  catchAsync(async (req, res) => {
    const id = req.params.id;

    const buf = await profileBannerCache.get(id);

    if (!buf) {
      throw new ApiError(404, `Not found`);
    }

    res.writeHead(200, {
      "Content-Type": `image/png`,
      "Content-Length": buf.length,
    });

    res.end(buf);
  })
);

export default router;
