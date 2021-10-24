const express = require(`express`);

const router = express.Router();

const { Validate } = require(`../../lib`).middlewares;

router.route(`/`)
  .get((req, res) => {
    res.json({
      message: `yo this works`,
    });
  });

router.route(`/no-db`)
  .get(
    Validate(),
    (req, res) => {

    });

module.exports = router;
