const express = require(`express`);

const router = express.Router();

const { Validate } = require(`../../lib`).middlewares;

const { query } = require(`../../lib`).validations.queryValidation; 

router.route(`/`)
  .get((req, res) => {
    res.json({
      message: `yo this works`,
    });
  });

router.route(`/no-db`)
  .get(
    Validate(query),
    (req, res) => {
      res.send(`u are authorized to see this` + Date.now());
    });

module.exports = router;
