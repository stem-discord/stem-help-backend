const swaggerJsdoc = require(`swagger-jsdoc`);
const swaggerUi = require(`swagger-ui-express`);

const swaggerDefinition = require(`../docs`);

const specs = swaggerJsdoc({
  swaggerDefinition,
  apis: [`src/docs/*.yml`, `src/routes/*.js`],
});

module.exports = {
  serve: swaggerUi.serve,
  middleware: swaggerUi.setup(specs, {
    explorer: true,
  }),
};
