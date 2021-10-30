import express from "express";

export { default as config } from "../../config";
export * as util from "../../util";
export * as validations from "../../validations";
export * as middlewares from "../../middlewares";
export * as auth from "../../auth";
export * as services from "../../service";
export * as pages from "../../pages";

import * as tool from "../../tool";

export const Router = express.Router;
export const logger = tool.logger;
export const info = tool.logger.info;
export { tool };
