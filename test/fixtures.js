import config from "./config.js";
import { openConnections } from "../src/connection/index.js";

export async function mochaGlobalSetup() {
  if (config.CONNECTIONS) {
    const connections = config.CONNECTIONS.split(/\s*,\s*/);
    if (connections.length === 1 && connections[0].match(/\s*/)) {
      return;
    }
    await openConnections(connections);
  }
}
