import test from "./test";
import docs from "./docs";
import auth from "./auth";
import oauth from "./oauth";
import database from "./database";
import data from "./data";

import * as lib from "../lib ";

const router = new lib.Router();
const git = lib.util.git;

router.get(`/`, async (req, res) => {
  res.status(200).json({ message: `OK`, version: await git.status.getLastCommit() });
});

router.use(`/test`, test);

router.use(`/docs`, docs);

router.use(`/auth`, auth);

router.use(`/oauth`, oauth);

router.use(`/database`, database);

router.use(`/data`, data);

export default router;
