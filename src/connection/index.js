import * as google from "./google/index.js";
import * as mongo from "./mongo/index.js";
import * as stemInformation from "./stemInformation/index.js";
import * as discord from "./discord/index.js";

import { Logger } from "../tool/index.js";
import { async } from "../util/index.js";
import { ConnectionState } from "../types/index.js";

const { sleep } = async;

const logger = new Logger(`ConnectionManager`);

const modules = {
  mongo,
  discord,
  stemInformation,
};

const connections = Object.values(modules).map(m => {
  const c = m.connection;
  if (c === undefined) {
    throw new Error(`Module ${m.name} has no connection export`);
  }
  return c;
});

let hasLoggedRegister = false;

const moduleNames = [];
for (const name of Object.keys(modules)) {
  moduleNames.push(name);
}

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
        return `⚠️  ${connection.state} ${
          connection.rejectReason ?? `Unknown reason`
        }`;
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
  if (!hasLoggedRegister) {
    logger.info(`Registered modules: ${moduleNames.join(`, `)}`);
    hasLoggedRegister = true;
  }

  if (selection === undefined) {
    selection = Object.keys(modules);
  } else {
    if (!Array.isArray(selection)) {
      throw new Error(`Expected array, got ${typeof selection}`, selection);
    }
    const s = [];
    sl: for (const sel of selection) {
      const name = sel.toLowerCase();
      // find a module with matching name
      for (const key of Object.keys(modules)) {
        if (key.toLowerCase().includes(name)) {
          s.push(key);
          continue sl;
        }
      }
      throw new Error(
        `Unknown module ${sel}. Available modules: [${Object.keys(modules).join(
          `, `
        )}]`
      );
    }
    selection = s;
  }

  logger.info(
    `Awaiting for module initialization...` +
      (selection ? ` [${selection.join(`, `)}]` : ``)
  );
  const initializations = selection
    .map(v => modules[v])
    .map(c => c.connection.init().catch(e => logger.error(e)));
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

export {
  mongo,
  discord,
  stemInformation,
  connections,
  openConnections,
  closeConnections,
};
