import Joi from "joi";
import { password } from "./custom.js";

const register = {
  body: Joi.object().keys({
    username: Joi.string().required(),
    password: Joi.string().required().custom(password),
  }),
};

const login = {
  body: Joi.object().keys({
    username: Joi.string().required(),
    password: Joi.string().required(),
  }),
};

export { login, register };
