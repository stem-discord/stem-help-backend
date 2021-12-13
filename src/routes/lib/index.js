import express from "express";

export { default as config } from "../../config/index.js";
export * as util from "../../util/index.js";
export * as validations from "../../validations/index.js";
export * as middlewares from "../../middlewares/index.js";
export * as auth from "../../auth/index.js";
export * as shared from "../../shared/index.js";
export * as service from "../../service/index.js";

import * as tool from "../../tool/index.js";

export const Router = express.Router;
export const logger = tool.logger;
export const info = tool.logger.info;
export { tool };
