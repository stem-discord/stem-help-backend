import Discord from "discord.js";
import EventEmitter2 from "eventemitter2";
import { isMain, nullWrapper, git, scc } from "../util/index.js";
import config from "../config/index.js";
import shared from "../shared/index.js";
import * as discordService from "./discord.js";
import { client as discordClient } from "../connection/discord/index.js";
import { Logger } from "../tool/index.js";

const logger = new Logger(`STEM Bot`);

const client = new EventEmitter2();

const on = client._on;

client.on = function (event, listener) {
  Reflect.apply(on, client, [
    event,
    (...args) => {
      try {
        Reflect.apply(listener, client, args);
      } catch (e) {
        logger.error(e);
      }
    },
  ]);
};

/**
 * [eventname]: function. if true, pass through emit
 * event name "*" is the catch all
 */
client.handler = {};

if (config.env === `test`) {
  client.handler[`*`] = function () {
    return true;
  };
} else {
  client.handler[`*`] = function () {
    return nullWrapper(() => shared.discord.stem) === null;
  };
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

function handleIssueToken(message) {
  if (message.content === `!token`) {
    if (message.channel?.type !== `DM`) {
      message.reply(`You must issue this command in a DM channel`);
      return true;
    }

    const token = discordService.createToken(message.author.id);

    message.reply(`Your token is: ${token}`);
    return true;
  }
  return false;
}

client.on(`messageCreate`, async message => {
  if (handleIssueToken(message)) return;
  if (message.content.match(`stemapi stats`)) {
    let s = ``;

    for (const v of [
      `Branch: \`${await git.status.getBranch()}\``,
      `Commit: \`${await git.status.getLastCommit()}\``,
      `File count: \n\`\`\`\n${await scc.stats()}\`\`\``,
    ]) {
      s += `${v}\n`;
    }

    await message.reply(s);
    return;
  }
  if (
    !shared.discord.stem.guild ||
    message.guild?.id !== shared.discord.stem.guild.id
  )
    return;
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
