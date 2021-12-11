import httpStatus from "http-status";
import mongoose from "mongoose";

import * as lib from "../../lib/index.js";

const { mongo } = lib.shared;
const { catchAsync } = lib.util;
const { ApiError } = lib.util;

const router = lib.Router();

router.route(`/:id`)
  .get(catchAsync(async (req, res) => {
    let { id } = req.params;
    try {
      id = mongoose.Types.ObjectId(id);
    } catch (e) {
      throw new ApiError(httpStatus.BAD_REQUEST, `Invalid ID`);
    }
    const result = await mongo.Data.findById(id);
    if (!result) {
      throw new ApiError(httpStatus.NOT_FOUND, `Data not found`);
    }
    res.status(httpStatus.OK).json(result);
  }),
  );

router.route(`/`)
  .post(
    // lib.auth.jwt.jwtAccess,
    catchAsync(async (req, res, next) => {
      const user = req.user;
      const can = await lib.auth.hellgate.rings.data.can(user, `create`);
      if (!can) {
        throw new ApiError(httpStatus.FORBIDDEN, `Not allowed`);
      }
      next();
    }),
    catchAsync(async (req, res) => {
      const obj = await mongo.Data.create(req.body);
      res.status(httpStatus.CREATED).json(obj);
    }),
  );

export default router;
