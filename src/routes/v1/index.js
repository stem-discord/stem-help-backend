const express = require(`express`);

const router = express.Router();

const test = require(`./test`);
const docs = require(`./docs`);

router.use(`/test`, test);

router.use(`/docs`, docs);

module.exports = router;
