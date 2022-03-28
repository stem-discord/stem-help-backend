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
  mathjs as utilmathjs,
  async as utilasync,
} from "../../util/index.js";
const { limitedEvaluate } = utilmathjs;
const { sleep } = utilasync;
import JSONF from "dead-easy-json";
import config from "../../config/index.js";
import shared from "../../shared/index.js";
import * as discordService from "../discord.js";
import { client as discordClient } from "../../connection/discord/index.js";
import { Logger } from "../../tool/index.js";

const logger = new Logger(`STEM Bot`);

const client = new EventEmitter2();

const on = client._on;

fs.existsSync(dirname(import.meta, `playerdata.json`)) ||
  fs.writeFileSync(
    dirname(import.meta, `playerdata.json`),
    `{ "players": {} }`
  );

const { file } = JSONF(
  dirname(import.meta, `playerdata.json`),
  {},
  {
    writeInterval: 100,
  }
);

file.disabledChannels ??= [];

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

const findEquationGames = {};

const points = [5, 3, 1];

const pointsSymbol = Symbol(`points`);

function eqSet(as, bs) {
  if (as.size !== bs.size) return false;
  for (var a of as) if (!bs.has(a)) return false;
  return true;
}

async function handleStats(message) {
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
    return true;
  }
  return false;
}

async function handleMainMathgame(message) {
  if (message.content.match(/^stem mathgame$/)) {
    if (file.disabledChannels.includes(message.channel.id)) {
      message.reply(`mathgame is disabled for this channel`);
      return true;
    }
    if (findEquationGames[message.channel.id]) {
      message.reply(`there is already a game going on`);
      return true;
    }

    findEquationGames[message.channel.id] = true;

    const winners = [];
    const winnerNumberSets = [];

    const collector = message.channel.createMessageCollector({
      time: 60 * 1000,
      filter: m =>
        !winners.find(v => v.id === m.author.id) &&
        m.author.id !== discordClient.user.id,
    });

    const target = 15 + Math.floor(Math.random() * 20);

    const numbers = [];
    for (let i = 0; i < 10; i++) {
      let num;
      while (
        (num =
          Math.random() > 0.2
            ? Math.floor(1 + Math.random() * 99)
            : Math.floor(1 + Math.random() * 9)) === target ||
        numbers.includes(num)
        // eslint-disable-next-line no-empty
      ) {}
      numbers.push(num);
    }

    message.channel.send(
      `Here are you numbers: \`[${numbers.join(
        `, `
      )}]\`\nTry and make: \`${target}\` out of these only using \`+, -, *, /, ^\``
    );

    collector.on(`collect`, async message => {
      let m;
      if ((m = message.content.match(/^[\d\s+\-*()/^]+$/))) {
        if (!findEquationGames[message.channel.id]) {
          return;
        }

        const formula = m[0].replace(/\*\*/g, `^`);
        let res;

        try {
          res = limitedEvaluate(formula);
        } catch (e) {
          return;
        }

        const nums = message.content.match(/\d+/g);
        const used = [];

        for (let num of nums) {
          num = Number(num);
          if (used.includes(num)) {
            message
              .reply(`You can only use a number once`)
              .then(async m => sleep(5000).then(() => m.delete()))
              .catch(() => {});
            return;
          }
          if (!numbers.includes(num)) {
            message
              .reply(
                `You can only use numbers in the number list. Invalid number: ${num}`
              )
              .then(async m => sleep(5000).then(() => m.delete()))
              .catch(() => {});
            return;
          }
          used.push(num);
        }

        const numberCount = nums.length;

        if (res === target) {
          for (const ns of Object.values(winnerNumberSets)) {
            const u = new Set(used);
            if (eqSet(ns, u)) {
              message
                .reply(`Someone has already used these same numbers`)
                .then(async m => sleep(5000).then(() => m.delete()))
                .catch(() => {});
              return;
            }
          }
          winnerNumberSets[message.author.id] = new Set(used);
          message.reply(
            `You got \`${points[winners.length]}\` points for position and \`${
              15 - numberCount
            }\` points for using \`${numberCount}\` numbers`
          );
          message.author[pointsSymbol] =
            15 - numberCount + points[winners.length];
          winners.push(message.author);
        }

        if (winners.length === 3) {
          collector.stop();
        }
      }
    });

    collector.on(`end`, async () => {
      delete findEquationGames[message.channel.id];
      if (winners.length) {
        winners.sort((a, b) => b[pointsSymbol] - a[pointsSymbol]);
        for (const winner of winners) {
          file.players[winner.id] ??= { wins: 0, score: 0 };
          file.players[winner.id].wins++;
          file.players[winner.id].score += winner[pointsSymbol];
        }
        message.channel.send(
          `The winners are: ${winners.join(`, `)}\`\n**Scoreboard**\n` +
            `\`\`\`md\n` +
            `${(
              await Promise.all(
                winners.map(
                  async v =>
                    `${
                      (await message.guild.members.fetch(v)?.displayName) ??
                      v.username
                    }: ${file.players[v.id].wins} wins, ${
                      file.players[v.id].score
                    } points`
                )
              )
            ).join(`\n`)}` +
            `\`\`\``
        );
      } else {
        message.channel.send(`Timed out. No winners`);
      }
    });
    return true;
  }
  return false;
}

client.on(`messageCreate`, async message => {
  if (handleIssueToken(message)) return;
  if (await handleStats(message)) return;
  if (message.guild?.id !== config.discord.server.stem) return;
  if (message.content.match(/^give me zen$/i)) {
    await message.member.roles.add(`882261053793239061`);
  }

  if (
    message.author.id === `589261729289207810` &&
    message.content.match(/i(?:'m|m| am) losing it/i)
  ) {
    await message.reply(`https://www.youtube.com/watch?v=KxGRhd_iWuE`);
    return;
  }

  let m;
  if ((m = message.content.match(/^(?:simplify|auto|solve)\s*(.+)/im))) {
    const eq = m[1];
    const res = mathstepsutil.explain(eq);
    if (res) {
      message.reply(res);
    }
  }

  if ((m = message.content.match(/^stem mathgame (disable|enable)$/))) {
    // disable for the chanel
    if (m[1] === `disable`) {
      file.disabledChannels.push(message.channel.id);
      message.reply(`disabled for this channel`);
    } else {
      file.disabledChannels = file.disabledChannels.filter(
        v => v !== message.channel.id
      );
      message.reply(`enabled for this channel`);
    }
    return;
  }

  if (await handleMainMathgame(message)) return;

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
    const { connection } = await import(`../../connection/discord/index.js`);
    await connection.init().then(() => {
      logger.info(`ready`);
    });
  })();
}

export { client };
