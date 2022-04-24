import ejs from "ejs";

import * as lib from "../../lib/index.js";

const { ApiError, catchAsync, pick } = lib.util;
const config = lib.config;

const router = lib.Router();

function html(str) {
  return String(str)
    .replace(/&/g, `&amp;`)
    .replace(/</g, `&lt;`)
    .replace(/>/g, `&gt;`)
    .replace(/"/g, `&quot;`);
}

const profileBannerCache = new lib.util.cache.FileSystemCache({
  basePath: `./.cache/profile-banner-cache`,
  transform: v => v,
  ttl: `60s`,
  toBuffer: v => v,
  generator: async id => {
    if (!id) return null;
    let { user } = (
      await lib.shared.discordgql
        .query`query { user(id: "${id}") { displayAvatarURL(format: "png", size: 128) } }`
    ).data;

    let pfp =
      user.displayAvatarURL ||
      `https://user-images.githubusercontent.com/24848110/33519396-7e56363c-d79d-11e7-969b-09782f5ccbab.png`;

    // TODO make a resource manager for this
    return lib.service.generatePngFromHtml.generate(
      await new Promise((resolve, reject) => {
        ejs.renderFile(
          `${process.cwd()}/assets/html/idcard.ejs`,
          {
            user: {
              pfp,
            },
          },
          {},
          (err, str) => (err ? reject(err) : resolve(str))
        );
      })
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
