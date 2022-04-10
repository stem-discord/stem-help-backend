import Discord from "discord.js";

import config from "../../config/index.js";
import { Connection, NullConnection, Namespace } from "../connection.js";

Discord.Intents.ALL = Object.values(Discord.Intents.FLAGS).reduce(
  (acc, p) => acc | p,
  0
);

const ns = new Namespace(`DiscordBot`, `Discord bot client`);
const logger = ns.logger;

class CustomClient extends Discord.Client {
  constructor(options) {
    super(options);
    this._taskQueue = {};
    this._taskCounter = 0;
  }
}

let connection;
const client = new CustomClient({
  partials: [`MESSAGE`, `CHANNEL`, `REACTION`],
  intents: Discord.Intents.ALL,
  disableMentions: `all`,
});

// Override user fetch function
(() => {
  const clientFetch = client.users.fetch.bind(client.users);
  client.users.fetch = async function (...args) {
    // eslint-disable-next-line eqeqeq
    if (args[0] == 0) {
      return {
        id: `0`,
        bot: false,
        system: false,
        flags: { bitfield: 0 },
        username: `Anonymous`,
        discriminator: `0000`,
        avatar: null,
        banner: null,
        accentColor: null,
      };
    }
    return clientFetch(...args);
  };
})();

if (config.discord.botToken) {
  Discord.Intents.ALL = Object.values(Discord.Intents.FLAGS).reduce(
    (acc, p) => acc | p,
    0
  );
  let clientReady;
  const open = new Promise(r => {
    clientReady = r;
  });

  client.on(`error`, e => {
    logger.error(`Discord client error`, e.toString());
  });

  client.on(`ready`, () => {
    logger.info(`logged in as ${client.user.tag}`);
    clientReady();
  });

  let calledLogin = false;

  connection = new Connection({
    ...ns,
    init: async () => {
      if (!calledLogin) await client.login(config.discord.botToken);
      // eslint-disable-next-line require-atomic-updates
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

connection.client = client;

export { connection, client };
