import config from "../../config/index.js";
import { Namespace } from "../connection.js";
import { createMongoConnection } from "../mongo.js";

const ns = new Namespace(`MongoDB`, `Database connection with mongodb`);

const obj = createMongoConnection({ config, ns });

export const connection = obj.connection;
export const mongooseConnection = obj.mongooseConnection;
