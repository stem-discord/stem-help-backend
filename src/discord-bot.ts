import { openConnections, discord } from "./connection/index.js";

openConnections([`discord`]);

const { client } = discord;

export { client };
