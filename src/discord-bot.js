// @ts-ignore
import Discord from "discord.js";
import config from "./config/index.js";

// @ts-ignore
Discord.Intents.ALL = Object.values(Discord.Intents.FLAGS).reduce(
  // @ts-ignore
  (acc, p) => acc | p,
  0
);

const client = new Discord.Client({
  partials: [`MESSAGE`, `CHANNEL`, `REACTION`],
  // @ts-ignore
  intents: Discord.Intents.ALL,
  // @ts-ignore
  disableMentions: `all`,
});

client.login(config.discord.botToken);

export { client };
