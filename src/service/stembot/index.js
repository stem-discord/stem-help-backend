import fs from "fs";
import Discord from "discord.js";
import EventEmitter2 from "eventemitter2";
import {
  isMain,
  nullWrapper,
  git,
  scc,
  async,
  dirname,
  mathstepsutil,
} from "../../util/index.js";
import config from "../../config/index.js";
import shared from "../../shared/index.js";
import * as discordService from "../discord.js";
import { client as discordClient } from "../../connection/discord/index.js";
import { Logger } from "../../tool/index.js";

const logger = new Logger(`STEM Bot`);

const client = new EventEmitter2();

const on = client._on;

client.on = function (event, listener) {
  Reflect.apply(on, client, [
    event,
    async (...args) => {
      try {
        await Reflect.apply(listener, client, args);
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

const commonWords = fs
  .readFileSync(dirname(import.meta, `./common_words.csv`), `utf-8`)
  .split(/\s*(?:[\n\r]+|,)\s*/);

function handleCommonEnglishWords(message) {
  const wl = [];
  for (const w of commonWords) {
    if (message.content.toLowerCase().includes(w)) {
      wl.push(w);
    }
  }
  if (wl.length) {
    const m = message.reply(`detected common words: ${wl.join(`, `)}`);
    return m
      .then(async m => {
        await async.sleep(7000);
        message.delete().catch(() => {});
        return m.delete().catch(() => {});
      })
      .catch(v => logger.error(v));
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
  if (message.guild?.id !== config.discord.server.stem) return;
  if (message.content.match(/^give me zen$/i)) {
    await message.member.roles.add(`882261053793239061`);
  }
  let m;
  if ((m = message.content.match(/^(?:simplify|auto|solve)\s*(.+)/im))) {
    const eq = m[1];
    console.log(eq);
    const res = mathstepsutil.explain(eq);
    if (res) {
      console.log(`here`);
      message.reply(res);
    }
  }
  if (message.author.id === `341446613056880641`) {
    if (message.content === `stemtest`) {
      await message.reply(`hi`);
    }
    // if (!message.content.startsWith(`.`) && handleCommonEnglishWords(message))
    //   return;
    if (message.content === `stemdisable`) {
      // There is no way to enable this again though
      // Just a proof of concept for now
      client.handler[`messageCreate`] = () => true;
    }
  }
});

function emitPromise(event, ...args) {
  return Promise.all(client.listeners(event).map(f => f(...args)));
}

// Passthrough
for (const event of Object.values(Discord.Constants.Events)) {
  discordClient.on(event, async (...args) => {
    for (const n of [event, `*`]) {
      const func = client.handler?.[n];
      if (func && (await func(...args))) return;
    }
    await emitPromise(event, ...args);
  });
}

client.emitPromise = emitPromise;

if (isMain(import.meta)) {
  (async () => {
    const { connection } = await import(`../connection/discord`);
    await connection.init().then(() => {
      logger.log(`ready`);
    });
  })();
}

export { client };
