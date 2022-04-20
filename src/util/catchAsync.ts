// import type { Handler } from "@types/express";

// TODO figure out types for this
const catchAsync = fn => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(err => next(err));

export default catchAsync;
