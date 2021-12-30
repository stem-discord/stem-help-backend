import config from "../../config/index.js";
import { Namespace } from "../connection.js";
import { createMongoConnection } from "../mongo.js";

const ns = new Namespace(`MongoDB`, `Database connection with mongodb`);

export const connection = createMongoConnection({
  config: config.mongoose,
  ns,
});
