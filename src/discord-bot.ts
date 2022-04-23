import dotenv from "dotenv";

import { openConnections, discord } from "./connection/index.js";

openConnections([`discord`, `mongo`]);

const { client } = discord;

export { client };
