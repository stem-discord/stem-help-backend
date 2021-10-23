const UserInterface = require(`../userInterface`);
const Discord = require(`discord.js`);
const { config } = require(`../../config`);

class DiscordUI extends UserInterface {
  constructor(client) {
    super(`discord`);
    this.client = client;
  }

  send(user, messageObject) {
    // 839399426643591188
    const channel = this.client.channels.cache.get(`839399426643591188`);
    if (channel) {
      return channel.send(messageObject);
    }
    throw new Error(`Channel not found`);
  }

  awaitUserInput(user) {
    // implement later
    super.awaitUserInput(user);
  }
}


const client = new Discord.Client({
  partials: [`MESSAGE`, `CHANNEL`, `REACTION`],
  disableMentions: `all`,
  token: config.discordToken,
});

client.login();

module.exports = DiscordUI(
  client,
);