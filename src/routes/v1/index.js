import test from "./test";
import docs from "./docs";
import auth from "./auth";
import oauth from "./oauth";

import * as lib from "../lib ";

const router = new lib.Router();

router.use(`/test`, test);

router.use(`/docs`, docs);

router.use(`/auth`, auth);

router.use(`/oauth`, oauth);

export default router;
