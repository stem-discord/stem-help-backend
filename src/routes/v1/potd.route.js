const express = require(`express`);

const { potdController } = require(`../../controllers`);
const { potdValidation } = require(`../../validations`);
const validate = require(`../../middlewares/validate`);

const router = express.Router();

router
  .route(`/create`)
  .post(
    validate(potdValidation.create),
    potdController.create,
  );
//   .get(
//     auth(`getUsers`),
//     validate(userValidation.getUsers),
//     userController.getUsers,
//   );

module.exports = router;

// frik documentation
