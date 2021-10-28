import * as google from "./google";
import * as mongo from "./mongo";
import { Logger } from "../tool";


const logger = new Logger(`ConnectionManager`);

const connections = {
  google,
  mongo,
};

// TODO: improve this connection api
for (const [name, module] of Object.entries(connections)) {
  logger.info(`connection [${name}] - ${Object.entries(module).map(v => {
    const [name, func] = v;
    if (func.enabled) {
      return `${name}✔️ `;
    }
    return `${name} ❌`;
  }).join(`, `)}`);
}

export default connections;
