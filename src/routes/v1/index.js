import test from "./test";
import docs from "./docs";
import auth from "./auth";
import oauth from "./oauth";
import database from "./database";

import * as lib from "../lib ";

const router = new lib.Router();

router.use(`/test`, test);

router.use(`/docs`, docs);

router.use(`/auth`, auth);

router.use(`/oauth`, oauth);

router.use(`/database`, database);

export default router;
