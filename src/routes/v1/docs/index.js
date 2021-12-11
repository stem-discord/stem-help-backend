import * as lib from "../../lib/index.js";

const { swagger } = lib.service;

const router = lib.Router();

router.use(`/`, swagger.serve);
router.get(`/`, swagger.middleware);

export default router;
