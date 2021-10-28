import * as lib from "../../lib";

const { Validate } = lib.middlewares;
const { query } = lib.validations.queryValidation;

const router = lib.Router();

router.route(`/`)
  .get((req, res) => {
    res.json({
      message: `yo this works`,
    });
  });

router.route(`/no-db`)
  .get(Validate(query), (req, res) => {
    res.send(`u are authorized to see this` + Date.now());
  });
export default router;
