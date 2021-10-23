const express = require(`express`);

const router = express.Router();

router.route(`/`)
  .get((req, res) => {
    res.json({
      message: `yo this works`,
    });
  });

module.exports = router;
