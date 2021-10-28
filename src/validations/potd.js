import Joi from "joi";

const create = {
  question: Joi.string().required(),
  answer: Joi.string().required(),
  explanation: Joi.string().required(),
  metadata: Joi.string().required(),
  //   body: Joi.object().keys({
  //     email: Joi.string().required().email(),
  //     password: Joi.string().required().custom(password),
  //     name: Joi.string().required(),
  //     role: Joi.string().required().valid(`user`, `admin`),
  //   }),
};

export { create };
