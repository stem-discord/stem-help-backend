import * as google from "./google/index.js";
import * as mongo from "./mongo/index.js";
import * as discord from "./discord/index.js";

import { Logger } from "../tool/index.js";
import { async } from "../util/index.js";
import { ConnectionState } from "../types/index.js";

const { sleep } = async;

const logger = new Logger(`ConnectionManager`);

const modules = {
  mongo,
  discord,
};

const connections = Object.values(modules).map(m => m.connection);

const moduleNames = [];
for (const name of Object.keys(modules)) {
  moduleNames.push(name);
}

logger.info(`Registered modules: ${moduleNames.join(`, `)}`);

function connDesc(connection) {
  // The connection is configured
  if (!connection.null) {
    // configured and operational
    if (connection.isOperational()) {
      return (
        `✔️  ${connection.state}` +
        (connection.message ? ` - ${connection.message}` : ``)
      );
    }
    // not operational, for two reasons
    else {
      // waiting for opening
      if (
        [ConnectionState.UNINITIALIZED, ConnectionState.CONNECTING].includes(
          connection.state
        )
      ) {
        return `⏳ ${connection.state}`;
      } else if (
        [ConnectionState.DISCONNECTED, ConnectionState.DISCONNECTING].includes(
          connection.state
        )
      ) {
        return `⚠️  ${connection.state} ${connection.rejectReason}`;
      }
    }
  } else {
    return (
      `✖️  Not configured` +
      (connection.rejectReason ? ` → ${connection.rejectReason}` : ``)
    );
  }
  return `❔ Unknown status ${connection.state}`;
}

const openConnections = async selection => {
  selection ??= Object.keys(modules);
  if (!Array.isArray(selection)) {
    throw new Error(`Expected array, got ${typeof selection}`, selection);
  }
  logger.info(
    `Awaiting for module initialization...` +
      (selection ? ` [${selection.join(`, `)}]` : ``)
  );
  const initializations = Object.entries(modules)
    .filter(v => selection.includes(v[0]))
    .map(v => v[1])
    .map(c => c.connection.init());
  await Promise.any([sleep(10000), Promise.allSettled(initializations)]);
  const reports = [];
  const WIDTH = 20;
  for (const connection of connections) {
    reports.push(`➣ [${connection.name}]`.padEnd(WIDTH) + connDesc(connection));
  }
  logger.info(
    `== Open Connection Report ==\n` +
      `Module name`.padEnd(WIDTH) +
      `  Status\n` +
      reports.join(`\n`)
  );
};

async function closeConnections() {
  return await Promise.all(connections.map(c => c.close()));
}

export { mongo, discord, connections, openConnections, closeConnections };
