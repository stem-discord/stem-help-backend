const express = require(`express`);

const router = express.Router();

const test = require(`./test`);
const docs = require(`./docs`);
const auth = require(`./auth`);
const oauth = require(`./oauth`);

router.use(`/test`, test);

router.use(`/docs`, docs);

router.use(`/auth`, auth);

router.use(`/oauth`, oauth);

module.exports = router;
