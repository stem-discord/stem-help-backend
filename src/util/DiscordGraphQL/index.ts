import {
  GraphQLSchema,
  GraphQLObjectType as ObjectType,
  GraphQLString as Str,
  GraphQLList as List,
  GraphQLInt as Int,
  GraphQLNonNull as NN,
  GraphQLBoolean as Bool,
} from "graphql";

import * as Discord from "discord.js";

export function SchemaFromClient(client: Discord.Client) {
  const Snowflake = NN(Str);
  const TypeSnowflake = { type: Snowflake };

  const Role = new ObjectType({
    name: `Role`,
    fields: {
      name: { type: Str },
      hexColor: { type: Str },
      hoist: { type: Bool },
      position: { type: Int },
      rawPostition: { type: Int },
    },
  });

  const User = new ObjectType({
    name: `DiscordUser`,
    fields: {
      id: TypeSnowflake,
      username: { type: Str },
      discriminator: { type: Int },
      tag: {
        type: Str,
      },
      displayAvatarURL: {
        type: Str,
        args: {
          size: { type: Int },
          format: { type: Str },
        },
        resolve: (user, options) => user.displayAvatarURL(options),
      },
      avatarURL: { type: Str },
    },
  });

  const GuildMember = new ObjectType({
    name: `DiscordGuildMember`,
    fields: {
      roles: {
        type: new List(Role),
        resolve: member => member.roles.cache.values(),
      },
      user: {
        type: User,
        resolve: member => member.user,
      },
    },
  });

  const Guild = new ObjectType({
    name: `DiscordGuild`,
    fields: {
      id: TypeSnowflake,
      name: { type: Str },
      owner: {
        type: GuildMember,
        resolve: async guild => guild.fetchOwner(),
      },
      member: {
        type: GuildMember,
        args: {
          id: TypeSnowflake,
        },
        resolve: async (guild, { id }) => {
          if (!id) throw new Error(`Must provide an id`);
          return guild.members.fetch(id);
        },
      },
    },
  });

  const Channel = new ObjectType({
    name: `Channel`,
    fields: {
      id: TypeSnowflake,
    },
  });

  const Message = new ObjectType({
    name: `Message`,
    fields: {
      content: { type: Str },
      cleanContent: { type: Str },
      author: { type: User },
      channel: { type: Channel },
    },
  });

  const RootQuery = new ObjectType({
    name: `RootQuery`,
    fields: () => ({
      status: { type: Str, resolve: () => `200` },
      guild: {
        type: Guild,
        args: {
          id: TypeSnowflake,
        },
        resolve: (parent, args) => client.guilds.cache.get(args.id),
      },
      user: {
        type: User,
        args: {
          id: TypeSnowflake,
        },
        resolve: (parent, args) => client.users.cache.get(args.id),
      },
    }),
  });

  return new GraphQLSchema({
    query: RootQuery,
  });
}
