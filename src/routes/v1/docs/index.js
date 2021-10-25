const lib = require(`../../lib`);

const { swagger } = lib.services;

const router = lib.Router();

router.use(`/`, swagger.serve);
router.get(
  `/`,
  swagger.middleware,
);

module.exports = router;
