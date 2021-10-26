const ejs = require(`ejs`);

const config = require(`../../config`);
const util = require(`../../util`);


const validations = require(`../../validations`);
const middlewares = require(`../../middlewares`);
const services = require(`../../service`);

const tool = require(`../../tool`);

module.exports = {
  // standalones
  config,
  util,

  // utilization
  validations,
  middlewares,
  services,

  // easy access
  Router: require(`express`).Router,
  logger: tool.logger,
  info: tool.logger.info,

  // ejs stuff
  render: ejs.render,
  pages: require(`../../pages`),
};
