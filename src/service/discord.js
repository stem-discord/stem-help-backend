
import shared from "../shared";
import { pick, normalize } from "../util";
import Discord from "discordjs";

// TODO fix this jsdoc

/**
 * @returns {Promise<Discord.User[]>}
 */
async function userResolveAnything(anything, { limit = 10 }) {
  await shared.discord.client.users.fetch();
  // let count = 0;
  // const res = [];

  // for (let [key, val] of shared.discord.client.users.cache) {
  //   if ((() => {
  //     const stemMember = shared.discord.stem.members.resolve(val);
  //     if (stemMember) {
  //       val = stemMember;
  //       if (true) {}
  //     }

  //   })()) {
  //     res.push(val, [`username`, `tag`, `discriminator`, `createdTimestamp` ]);
  //   }
  //   if (count === 10) break;
  // }
  // return res;
}

export { userResolveAnything };
