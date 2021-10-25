const lib = require(`../lib`);

const test = require(`./test`);
const docs = require(`./docs`);
const auth = require(`./auth`);
const oauth = require(`./oauth`);

const router = new lib.Router();

router.use(`/test`, test);

router.use(`/docs`, docs);

router.use(`/auth`, auth);

router.use(`/oauth`, oauth);

module.exports = router;
