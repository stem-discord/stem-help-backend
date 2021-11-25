import httpStatus from "http-status";

import * as lib from "../../lib";

const { database } = lib.service;
const { catchAsync } = lib.util;

const router = lib.Router();

router.route(`/:id`)
  .get(catchAsync(async (req, res) => {
    res.send(`asdfjadlsf`);
  }),
  );

export default router;
