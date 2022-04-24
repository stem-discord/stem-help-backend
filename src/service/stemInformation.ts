import shared from "../shared/index.js";
import config from "../config/index.js";

/**
 * Legacy api. Will return false when user is not found
 */
export async function getUserStats(id: string) {
  const query = { server: config.discord.server.stem, user_id: id };
  const q = (await shared.stemInformation.UserInfoPublic.findOne(
    query
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ).lean()) as any;
  const q2 = await shared.stemInformation.ThankedLog.findOne(query).lean();
  if (!q) return false;
  if (!q2) return false;
  return {
    ...q2,
    stats: q?.stats,
  };
}
