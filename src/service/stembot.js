import Discord from "discord.js";
import EventEmitter2 from "eventemitter2";
import { isMain, nullWrapper } from "../util/index.js";
import config from "../config/index.js";
import shared from "../shared/index.js";
import { client as discordClient } from "../connection/discord/index.js";
import { Logger } from "../tool/index.js";

const logger = new Logger(`STEM Bot`);

const client = new EventEmitter2();

const on = client._on;

client.on = function(event, listener) {
  Reflect.apply(on, client, [event, (...args) => {
    try {
      Reflect.apply(listener, client, args);
    } catch (e) {
      logger.error(e);
    }
  }]);
};

/**
 * [eventname]: function. if true, pass through emit
 * event name "*" is the catch all
 */
client.handler = {};

if (config.env !== `production`) {
  client.handler[`*`] = function() { return true; };
} else {
  client.handler[`*`] = function() { return nullWrapper(() => shared.discord.stem) === null; };
}

// Passthrough
for (const event of Object.values(Discord.Constants.Events)) {
  discordClient.on(event, (...args) => {
    for (const n of [event, `*`]) {
      const func = client.handler?.[n];
      if (func && func(...args)) return;
    }
    client.emit(event, ...args);
  });
}


client.on(`messageCreate`, async message => {
  if (message.guild?.id !== shared.discord.stem.guild.id) return;
  if (message.content.match(/^give me zen$/i)) {
    await message.member.roles.add(`882261053793239061`);
  }
  if (message.author.id === `341446613056880641`) {
    if (message.content === `stemtest`) {
      await message.reply(`hi`);
    }
    if (message.content === `stemdisable`) {
      // There is no way to enable this again though
      // Just a proof of concept for now
      client.handler[`messageCreate`] = () => true;
    }
  }
});


if (isMain(import.meta)) {
  (async () => {
    const { connection } = await import(`../connection/discord`);
    await connection.init().then(() => {
      logger.log(`ready`);
    });
  })();
}

export { client };
