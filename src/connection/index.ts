import * as mongo from "./mongo/index.js";
import * as mongosession from "./mongosession/index.js";
import * as stemInformation from "./stemInformation/index.js";
import * as stemShield from "./stemShield/index.js";
import * as discord from "./discord/index.js";
import * as discordgql from "./discordgql/index.js";

import { Logger } from "../tool/index.js";
import { async } from "../util/index.js";
import { ConnectionState } from "../types/index.js";
import { Connection } from "./connection.js";

const { sleep } = async;

const logger = Logger(`ConnectionManager`);

const modules = {
  mongo,
  discord,
  stemInformation,
  discordgql,
  stemShield,
  mongosession,
};

const connections = Object.entries(modules).map(e => {
  const m = e[1];
  const c = m.connection;
  if (c === undefined) {
    throw new Error(`Module has no connection export '${e[0]}.js'`);
  }
  return c;
});

let hasLoggedRegister = false;

const moduleNames: string[] = [];
for (const name of Object.keys(modules)) {
  moduleNames.push(name);
}

function connDesc(connection: Connection) {
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
        (
          [
            ConnectionState.UNINITIALIZED,
            ConnectionState.CONNECTING,
          ] as (keyof typeof ConnectionState)[]
        ).includes(connection.state)
      ) {
        return `⏳ ${connection.state}`;
      } else if (
        (
          [
            ConnectionState.DISCONNECTED,
            ConnectionState.DISCONNECTING,
          ] as (keyof typeof ConnectionState)[]
        ).includes(connection.state)
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

const openConnections = async (selection: string[]) => {
  if (!hasLoggedRegister) {
    logger.info(`Registered modules: ${moduleNames.join(`, `)}`);
    hasLoggedRegister = true;
  }

  if (selection === undefined) {
    selection = Object.keys(modules);
  } else {
    if (!Array.isArray(selection)) {
      throw new Error(
        `Expected array, got ${typeof selection} selection: ${selection}`
      );
    }

    const si = Object.create(null);
    sl: for (const sel of selection) {
      const name = sel.toLowerCase();

      // Exact match, only select one
      let m;
      if ((m = Object.keys(modules).find(v => v.toLowerCase() === name))) {
        si[m] = modules[m];
        continue sl;
      }

      // find a module with matching name
      for (const key of Object.keys(modules)) {
        if (si[key]) continue;
        if (key.toLowerCase().includes(name)) {
          si[key] = true;
          continue sl;
        }
      }
      throw new Error(
        `Unknown module ${sel}. Available modules: [${Object.keys(modules).join(
          `, `
        )}]`
      );
    }
    selection = Object.keys(si);
  }

  logger.info(
    `Awaiting for module initialization...` +
      (selection ? ` [${selection.join(`, `)}]` : ``)
  );

  const selectedConnections: Connection[] = selection.map(
    v => modules[v].connection
  );

  // Duplicate code because file name is not exposed to connection
  const initializations = selection.map(v =>
    modules[v].connection.init().catch(e => {
      logger.error(`An error has occured with module "${v}"`);
      if (e.processed) return;
      logger.error(e);
    })
  );
  await Promise.any([sleep(10000), Promise.allSettled(initializations)]);
  const reports: string[] = [];
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

  // Now start listening for status changes
  for (const connection of selectedConnections) {
    connection.statusUpdate = state => {
      logger.info(
        `[${connection.name}] is now: ${state}` +
          (connection.isOperational() ? `` : ` -> ${connection.rejectReason}`)
      );
    };
  }
};

async function closeConnections() {
  return await Promise.all(connections.map(c => c.close()));
}

export {
  mongo,
  mongosession,
  discord,
  discordgql,
  stemInformation,
  connections,
  openConnections,
  closeConnections,
};
