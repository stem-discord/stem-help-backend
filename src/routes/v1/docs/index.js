const express = require(`express`);
const router = express.Router();

const { swagger } = require(`../../lib`).services;

router.use(`/`, swagger.serve);
router.get(
  `/`,
  swagger.middleware,
);

module.exports = router;
