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
    let user = await lib.shared.discord.client.users.fetch(id);

    return lib.service.generatePngFromHtml.generate(
      `

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100;0,200;0,300;0,400;0,500;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet">
    <style>
      :root {
        --pfp-area-color: #fefaec;
        --pfp-area-bg-color: #624772;
        --banner-area-color: #fefaec;
        --banner-area-bg-color: #f38181;
      }

      * {
        transform-origin: bottom left;
        font-family: 'Montserrat', sans-serif;
      }

      p {
        margin: 0;
      }

    </style>
    <div style="
    background-image: url('https://cdn.discordapp.com/attachments/951455566717419580/965892818407145482/unknown.png');
    padding: 14px;
    width: 600px;
    height: 100px;
    ">
      <div style="
      color: var(--banner-area-color);
      display: flex;
      background-size: cover;
      height: 100%;
      width: 100%;
      position: relative;
      ">
        <div style="
        aspect-ratio: 1 / 1;
        height: 50%;
        color: var(--pfp-area-color);
        padding: 3px;
        box-sizing: border-box;
        /* background-color: var(--pfp-area-bg-color); */
        ">
          <img src="https://cdn-icons-png.flaticon.com/512/5968/5968898.png" style="
            width: 100%;
            height: 100%;
            margin-top: 30px;
            margin-left: -5px;
            filter: invert(100%);
            ">
        </div>
        <div style="
        aspect-ratio: 1 / 1;
        height: 100%;
        padding-top: 16px;
        box-sizing: border-box;
        color: var(--pfp-area-color);
        /* background-color: var(--pfp-area-bg-color); */
        ">
          <img src="${
            html(user.displayAvatarURL({ format: `png`, size: 128 })) ??
            `https://user-images.githubusercontent.com/24848110/33519396-7e56363c-d79d-11e7-969b-09782f5ccbab.png`
          }" style="
            height: 100%;
            aspect-ratio: 1 / 1;
            border-radius: 50%;
            ">
        </div>
        <div style="
        width: 100%;
        display: flex;
        ">
          <!-- name and about me -->
          <div style="
            display: flex;
            flex-direction: column;
          ">
            <div style="display: flex;">
              <div style="display: flex;">
                <p style="font-size: 24px;">${html(user.username)}</p>
                <p>#1234</p>
              </div>
              <div style="margin-left: 15px;">
                <p style="font-style: italic; font-size: 14px;">ur brain is worse than instant noodles</p>
              </div>
            </div>
            <div style="height: 10px;">&nbsp</div>
            <div style="overflow: hidden">
              <p style="font-size: 14px; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical;"> Bromies with Promie Besties with sufuwushine ♡ Eyes that see the best in people A heart that forgives the worst A mind that forgets the ba </p>
            </div>
          </div>
          <!-- account info -->
          <div style="
          display: flex;
          flex-direction: column;
          width: 200px;">
            <div style="margin-bottom: 10px;">
              <p style="font-size: 18px;">Account Info</p>
            </div>
            <div style="overflow: hidden; white-space: nowrap;">
              <p style="
              display: inline-block; font-size: 14px;">Created: </p>
              <p style="
              font-size: 12px;
              display: inline-block; right: 0;">3 years ago</p>
            </div>
            <div>
              <p style="
              display: inline-block; font-size: 14px;">Age: </p>
              <p style="
              font-size: 12px;
              display: inline-block; right: 0;">18</p>
            </div>
          </div>
        </div>
        <div style="
          border-bottom: 5px solid white;
          position: absolute;
          z-index: 99;
          width: 100%;
          bottom: -8px;
          ">
        </div>
      </div>
      <div style="
          background-image: url('https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Discord_Black_Text_Logo_%282015-2021%29.svg/2560px-Discord_Black_Text_Logo_%282015-2021%29.svg.png');
          position: absolute;
          z-index: 99;
          width: 100%;
          top: 5px;
          left: 5px;
          background-size: contain;
          background-repeat: no-repeat;
          height: 20px;
          filter: invert(100%);
          ">
      </div>
    </div>
      `
    );
  },
});

profileBannerCache.clear().catch(_ => _);

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
