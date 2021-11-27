import { discord } from "../shared";

/**
 * @return {Promise<import("discord.js").User[]>}
 */
export async function userResolveAnything(anything, { limit = 10 }) {
  await discord.client.users.fetch();
  // let count = 0;
  const res = [];

  for (let user of discord.client.users.cache.values()) {
    // If we have the maximum number of users, stop.
    if (res.length === limit) {
      break;
    }

    const stemMember = discord.stem.members.resolve(user);
    if (stemMember) {
      res.push(stemMember, [
        `username`,
        `tag`,
        `discriminator`,
        `createdTimestamp`,
      ]);
    }
  }
  return res;
}
