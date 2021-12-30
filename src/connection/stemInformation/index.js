import config from "../../config/index.js";
import { Namespace } from "../connection.js";
import { createMongoConnection } from "../mongo.js";

const ns = new Namespace(
  `STEMInfoDB`,
  `Database connection with mongodb (STEM Discord)`
);

export const connection = createMongoConnection({
  config: config.stemInformation,
  ns,
});
