import Discord from "discord.js";

import config from "../../config/index.js";
import { Connection, NullConnection, Namespace } from "../connection.js";

const ALL = Object.values(Discord.Intents.FLAGS).reduce((acc, p) => acc | p, 0);

const ns = new Namespace(`DiscordBot`, `Discord bot client`);
const logger = ns.logger;

class CustomClient extends Discord.Client {
  constructor(options: Discord.ClientOptions) {
    super(options);
  }
}

let connection: Connection;

const client = new CustomClient({
  partials: [`MESSAGE`, `CHANNEL`, `REACTION`],
  intents: ALL,
});

// Override user fetch function
(() => {
  const clientFetch = client.users.fetch.bind(client.users);
  client.users.fetch = async function (...args) {
    // eslint-disable-next-line eqeqeq
    if (args[0] == `0`) {
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
  let clientReady;
  const open = new Promise(r => {
    clientReady = r;
  });

  client.on(`error`, e => {
    logger.error(`Discord client error`, e.toString());
  });

  client.on(`ready`, () => {
    logger.info(`logged in as ${client.user?.tag}`);
    clientReady();
  });

  let calledLogin = false;

  connection = new Connection({
    ...ns,
    init: async () => {
      let cinit: null | Promise<unknown> = null;
      if (!calledLogin) cinit = client.login(config.discord.botToken);

      await Promise.all([
        cinit, // Might be present
        // If stem server is configured, get it
        config.discord.server.stem &&
          client.guilds.fetch(config.discord.server.stem),
      ]);
      // eslint-disable-next-line require-atomic-updates
      calledLogin = true;
      return open;
    },
    heartbeat: () => {
      if (!client.isReady()) throw new Error(`client is not ready`);
    },
    close: () => {
      client.destroy();
    },
  });
} else {
  connection = new NullConnection(ns, `config.discord.botToken is missing`);
}

const cwc: typeof connection & {
  client?: typeof client;
} = connection;

cwc.client = client;

export { cwc as connection, client, CustomClient as __CustomClient };
