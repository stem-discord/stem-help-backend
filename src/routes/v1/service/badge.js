import * as lib from "../../lib/index.js";
import fetch from "node-fetch";

const { ApiError, catchAsync, pick, dirname, cache, git } = lib.util;
const config = lib.config;

const router = lib.Router();

let badgeHtml;

const stats = {};

// TODO idk make this customizable
function builder(title = ``, description = ``, color = `ff69b4`, logo = ``) {
  return `https://img.shields.io/badge/${encodeURI(title)}-${encodeURI(
    description
  )}-${encodeURI(color)}?style=for-the-badge&logo=${encodeURI(logo)}`;
}

// https://api.github.com/repos/lassana/continuous-audiorecorder/contents/
// There is an additional way to get information

router.get(
  `/git/:query`,
  catchAsync(async (req, res) => {
    const query = req.params.query;

    if (query === `file-count`) {
      stats.fileCount ??= git.status
        .getFileCount()
        .then(v => fetch(builder(`File Count`, v, undefined, `git`)))
        .then(v => v.text());
      // eslint-disable-next-line require-atomic-updates
      stats.fileCount = await stats.fileCount;

      return res
        .setHeader(`Content-Type`, `image/svg+xml`)
        .send(stats.fileCount);
    }

    throw new ApiError(404, `Query is not valid`);
  })
);

export default router;
