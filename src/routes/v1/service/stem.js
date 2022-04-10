import httpStatus from "http-status";

import * as lib from "../../lib/index.js";

const { ApiError, catchAsync } = lib.util;

const router = lib.Router();

router.get(
  `/thankedstats/:query?`,
  catchAsync(async (req, res) => {
    const query = req.params.query;
    if (!query) {
      throw new ApiError(httpStatus.BAD_REQUEST, `Missing query`);
    }

    // Will return false if user is not found
    const r = await lib.service.stemInformation.getUserStats(query);

    res.json(r);
  })
);

router.get(
  `/idcard/:query?`,
  catchAsync(async (req, res) => {
    const query = req.params.query;
    if (!query) {
      throw new ApiError(httpStatus.BAD_REQUEST, `Missing query`);
    }

    // Will return false if user is not found
    const r = await lib.service.stemInformation.getUserStats(query);

    res.json(r);
  })
);

export default router;
