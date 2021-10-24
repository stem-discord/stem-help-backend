const Joi = require(`joi`);

const query = {
  data: Joi.string().required(),
};

module.exports = query;
