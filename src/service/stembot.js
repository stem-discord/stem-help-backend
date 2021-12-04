import Discord from "discord.js";
import shared from "../shared";
import { client as discordClient } from "../connection/discord";

let client = discordClient;

if (!client) {
  const e = new Error(`Discord client not initialized`);
  const thr = () => {
    throw e;
  };
  client = new Proxy(e, {
    get() {
      thr();
    },
    set() {
      thr();
    },
  });
} else {
  client.on(`message`, async message => {
    if (message.author.id !== `341446613056880641`) return;
    if (message.content === `stemtest`) {
      await message.reply(`hi`);
    }
  });
}


export { client };
