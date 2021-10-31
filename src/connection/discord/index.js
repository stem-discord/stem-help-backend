import Discord from "discord.js";

import config from "../../config";
import { Connection, NullConnection, Namespace } from "../connection";
import { async } from "../../util";

const ns = new Namespace(`DiscordBot`, `Discord bot client`);
const logger = ns.logger;

let connection;
let client;

if (config.discord.botToken) {
  Discord.Intents.ALL = Object.values(Discord.Intents.FLAGS).reduce((acc, p) => acc | p, 0);
  let clientReady;
  const open = new Promise(r => {
    clientReady = r;
  });

  client = new Discord.Client({
    partials: [`MESSAGE`, `CHANNEL`, `REACTION`],
    intents: Discord.Intents.ALL,
    disableMentions: `all`,
  });

  client.on(`error`, e => {
    logger.error(`Discord client error`, e.toString());
  });

  client.on(`ready`, () => {
    clientReady();
  });

  client.login(config.discord.botToken);

  connection = new Connection({
    ...ns,
    init: open,
    heartbeat: client.isReady,
    close: () => {
      client.destroy();
    },
  });
} else {
  connection = new NullConnection(ns, `config.discord.botToken is missing`);
}

export { connection, client };
