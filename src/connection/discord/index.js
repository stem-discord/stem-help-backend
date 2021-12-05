import Discord from "discord.js";

import config from "../../config";
import { Connection, NullConnection, Namespace } from "../connection";
import { async } from "../../util";

Discord.Intents.ALL = Object.values(Discord.Intents.FLAGS).reduce((acc, p) => acc | p, 0);

const ns = new Namespace(`DiscordBot`, `Discord bot client`);
const logger = ns.logger;

class CustomClient extends Discord.Client {
  constructor(options) {
    super(options);
    this._taskQueue = {};
    this._taskCounter = 0;
  }

  on(event, callback) {
    super.on(event, async (...args) => {
      const i = this._taskCounter;
      let resolve;
      let reject;
      this._taskQueue[i] = new Promise((r, re) => { resolve = r; reject = re; });
      this._taskCounter++;
      try {
        resolve(await callback(...args));
      } catch (e) {
        logger.error(e);
        reject(e);
      }
      delete this._taskQueue[i];
    });
  }

  /**
   * Returns a promise
   */
  emitPromise(event, ...args) {
    args ??= [];

    const ignore = Object.keys(this._taskQueue);

    return new Promise((r, re) => {
      super.emit(event, ...args);
      setImmediate(() => {
        const waiting = [];
        for (const [k, v] of Object.entries(this._taskQueue)) {
          if (ignore.includes(k)) continue;
          waiting.push(v);
        }
        Promise.all(waiting).then(r).catch(re);
      });
    });
  }

  get tasks() {
    return Object.values(this._taskQueue);
  }

  get tasksAsPromise() {
    return Promise.all(this.tasks);
  }
}

let connection;
const client = new CustomClient({
  partials: [`MESSAGE`, `CHANNEL`, `REACTION`],
  intents: Discord.Intents.ALL,
  disableMentions: `all`,
});

if (config.discord.botToken) {
  Discord.Intents.ALL = Object.values(Discord.Intents.FLAGS).reduce((acc, p) => acc | p, 0);
  let clientReady;
  const open = new Promise(r => {
    clientReady = r;
  });

  client.on(`error`, e => {
    logger.error(`Discord client error`, e.toString());
  });

  client.on(`ready`, () => {
    clientReady();
  });

  let calledLogin = false;

  connection = new Connection({
    ...ns,
    init: () => {
      if (!calledLogin) client.login(config.discord.botToken);
      calledLogin = true;
      return open;
    },
    heartbeat: client.isReady,
    close: () => {
      client.destroy();
    },
  });
} else {
  connection = new NullConnection(ns, `config.discord.botToken is missing`);
}

export { connection, client };
