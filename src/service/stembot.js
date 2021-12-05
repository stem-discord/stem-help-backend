import Discord from "discord.js";
import EventEmitter2 from "eventemitter2";
import shared from "../shared";
import { client as discordClient } from "../connection/discord";

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
      client.handler[`messageCreate`] = () => true;
    }
  }
});


export { client };
