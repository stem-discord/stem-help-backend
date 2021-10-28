import Joi from "joi";

const query = {
  data: Joi.string().required(),
};

export { query };
