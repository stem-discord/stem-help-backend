import SortedArray from "sorted-array";
import stringSimilarity from "string-similarity";
import FormData from "form-data";
import { promisify } from "util";
// import Discord from "discord.js";

import shared from "../shared/index.js";
import { DSA, normalize, ApiError } from "../util/index.js";
import config from "../config/index.js";

const similarityScore = Symbol(
  `similarityScore. The lower the score, the greater the similarity`
);

const EMPTY_USER = {
  [similarityScore]: Infinity,
};

/**
 * @param {string} [anything] If it only has numbers and lenght is 16-19, it will attempt to see if the ID exists.
 * If this fails, it treats the number sequence as a username
 * if it has #, the front part will be interpreted as a username, and the second part will be interpreted as tag
 * the username or nickname (nickname higher priority by factor of 2) will be added to the similarity score if tag is present.
 * @param {Object} [options] `options.limit` maximum number of users to return. defaults to 10
 * @return {import("discord.js").User[]} Adds an additional property `nickname` if the user is in stem.
 */
function userResolveAnything(anything, { limit = 10 } = {}) {
  const client = shared.discord.client;
  const guild = shared.discord.stem.guild;
  // ID match
  if (anything.match(/^\d{16,19}$/)) {
    let user = client.user.cache.get(anything);
    if (user) {
      return [user];
    }
  }

  const userArray = new SortedArray.comparing(
    similarityScore,
    Array(limit).fill(EMPTY_USER)
  );

  const insert = obj => {
    userArray.insert(obj);
    userArray.array.pop();
  };

  const values = client.users.cache.values();

  const lastIndexOfPound = anything.lastIndexOf(`#`);

  let targetUsername, targetDiscriminator;

  if (lastIndexOfPound > 0) {
    targetUsername = anything.substring(0, lastIndexOfPound);
    targetDiscriminator = anything.substring(lastIndexOfPound + 1);
  } else {
    targetUsername = anything;
  }

  for (const user of values) {
    let score = 0;
    let { username, discriminator } = user;
    username = normalize(username);
    let nickname = guild.members.resolve(user)?.nickname;
    if (nickname) {
      user.nickname = nickname;
      const ss =
        2 * stringSimilarity.compareTwoStrings(targetUsername, nickname);
      score = ss > score ? ss : score;
    }
    if (username) {
      const ss = stringSimilarity.compareTwoStrings(
        targetUsername,
        username + discriminator
      );
      score = ss > score ? ss : score;
    }
    if (targetDiscriminator) {
      score += 0.2 * DSA.lcs.LCSFromStart(targetDiscriminator, discriminator);
    }
    user[similarityScore] = -1 * score;
    insert(user);
  }

  const arr = [...userArray.array];

  // splice to find non-EMPTY_USER
  const idx = arr.findIndex(obj => obj === EMPTY_USER);

  if (idx > 0) {
    arr.splice(idx);
  }

  return arr;
}

async function uploadFile(buffer, options) {
  if (!config.discord.uploadWebhook)
    return Promise.reject(new Error(`No uploadWebhook set`));

  const form = new FormData();

  form.append(`file`, buffer, {
    filename: options.filename,
  });
  return promisify(form.submit.bind(form))(config.discord.uploadWebhook);
}

async function sendToUser(userId, message) {
  const user = await shared.discord.client.users.fetch(userId);
  if (!user) throw new ApiError(`User not found`);
  return user.send(message);
}

export { userResolveAnything, uploadFile, sendToUser };
