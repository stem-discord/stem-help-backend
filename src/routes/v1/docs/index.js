import * as lib from "../../lib";

const { swagger } = lib.service;

const router = lib.Router();

router.use(`/`, swagger.serve);
router.get(`/`, swagger.middleware);

export default router;
