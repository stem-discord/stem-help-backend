import config from "../../config/index.js";
import { Namespace } from "../connection.js";
import { createMongoConnection } from "../mongo.js";

const ns = new Namespace(
  `STEMInfoDB`,
  `Database connection with mongodb (STEM Discord)`
);

const obj = createMongoConnection({ config: config.stemInformation, ns });

export const connection = obj.connection;
export const mongooseConnection = obj.mongooseConnection;
