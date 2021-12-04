import Discord from "discord.js";
import shared from "../shared";
import { client as discordClient } from "../connection/discord";

let client = discordClient;

client.on(`messageCreate`, async message => {
  if (message.author.id !== `341446613056880641`) return;
  if (message.content === `stemtest`) {
    await message.reply(`hi`);
  }
});

client.on(`messageCreate`, async message => {
  if (message.guild?.id !== shared.discord.stem.guild.id) return;
  if (message.content.match(/^give me zen$/i)) {
    await message.member.roles.add(`882261053793239061`);
  }
});


export { client };
