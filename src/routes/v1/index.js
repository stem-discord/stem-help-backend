import test from "./test/index.js";
import docs from "./docs/index.js";
import auth from "./auth/index.js";
import oauth from "./oauth/index.js";
import data from "./data/index.js";
import service from "./service/index.js";

import * as lib from "../lib/index.js";

const router = new lib.Router();
const git = lib.util.git;

router.get(`/`, async (req, res) => {
  res.status(200).json({ message: `OK`, version: await git.status.getLastCommit() });
});

router.use(`/test`, test);

router.use(`/docs`, docs);

router.use(`/auth`, auth);

router.use(`/oauth`, oauth);

router.use(`/data`, data);

router.use(`/service`, service);

export default router;
