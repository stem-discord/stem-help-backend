import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import swaggerDefinition from "../docs/index.js";

const specs = swaggerJsdoc({
  swaggerDefinition,
  apis: [`src/docs/v1/**/*.yml`],
});

export const serve = swaggerUi.serve;
export const middleware = swaggerUi.setup(specs, {
  explorer: true,
});
