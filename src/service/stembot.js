import Discord from "discord.js";
import EventEmitter2 from "eventemitter2";
import { isMain } from "../util/index.js";
import shared from "../shared/index.js";
import { client as discordClient } from "../connection/discord/index.js";

let client = new EventEmitter2();

/**
 * [eventname]: function
 * if return true, does not propagate. You can also return a string to indicate a reason for not propagating.
 * this should only be used in testing situations or an emergency stop in production
 */
client.handler = {};

// Passthrough
for (const event of Object.values(Discord.Constants.Events)) {
  discordClient.on(event, (...args) => {
    const func = client.handler?.[event];
    if (func && func(...args)) return;
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
  /* eslint-disable no-console */
  (async () => {
    const { connection } = await import(`../connection/discord`);
    await connection.init().then(() => {
      console.log(`ready`);
    });
  })();
}

export { client };
