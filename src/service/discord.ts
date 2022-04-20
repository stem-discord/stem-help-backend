import SortedArray from "sorted-array";
import stringSimilarity from "string-similarity";
import FormData from "form-data";
import { promisify } from "util";
import crypto from "crypto";

import { User } from "discord.js";

import shared from "../shared/index.js";
import {
  DSA,
  normalize,
  ApiError,
  cache,
  streamToBuffer,
} from "../util/index.js";

import { logger } from "../tool/index.js";

import config from "../config/index.js";

const { NodeCache, ProxyCache } = cache;

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
  if (!guild) {
    throw new Error(`Not in stem guild`);
  }

  // ID match
  if (anything.match(/^\d{16,19}$/)) {
    const user = client.users?.cache?.get(anything);
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

  const values = client.users.cache.values() as IterableIterator<
    User & {
      nickname?: string;
    }
  >;

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
    let { username } = user;
    const { discriminator } = user;
    username = normalize(username);
    const nickname = guild.members.resolve(user)?.nickname;
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

async function uploadFile(
  buffer,
  options: {
    filename?: string;
  } = {}
) {
  if (!config.discord.uploadWebhook) throw new Error(`No uploadWebhook set`);

  const form = new FormData();

  const filename = buffer.originalname ?? buffer.filename ?? options.filename;

  if (filename === undefined) {
    throw new Error(`Filename must be provided from buffer or from options`);
  }

  // Compatibility with Multer's File api
  if (!(buffer instanceof Buffer)) {
    buffer = buffer?.buffer ?? buffer;
  } else if (buffer instanceof ArrayBuffer) {
    buffer = Buffer.from(buffer);
  }

  form.append(`file`, buffer, {
    filename,
  });

  const r = promisify(form.submit.bind(form))(config.discord.uploadWebhook)
    .then(streamToBuffer)
    .then(v => JSON.parse(v).attachments[0].url)
    .catch(e => logger.error(e));
  if (r === null) {
    throw new Error(`Upload failed`);
  }

  return r;
}

async function sendToUser(userId: string, message: string) {
  const user = await shared.discord.client.users.fetch(userId);
  if (!user) throw new ApiError(404, `User not found`);
  return user.send(message);
}

const tokens = ProxyCache(
  new NodeCache({
    stdTTL: 48 * 60,
  })
);

function createToken(userId: string) {
  if (userId === undefined) {
    throw new Error(`user id is undefined`);
  }
  const token = crypto.randomBytes(8).toString(`hex`);
  tokens[userId] = token;
  return `${userId}_${token}`;
}

export { userResolveAnything, uploadFile, sendToUser, createToken, tokens };
