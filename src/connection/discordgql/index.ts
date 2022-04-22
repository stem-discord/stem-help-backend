/* eslint-disable @typescript-eslint/ban-ts-comment */
import config from "../../config/index.js";

import { gql, createClient } from "@urql/core";
import fetch, { Headers, Request, Response } from "node-fetch";

import { Connection, NullConnection, Namespace } from "../connection.js";

const ns = new Namespace(
  `Discord GraphQL`,
  `Discord GraphQL client for fetching data`
);
const logger = ns.logger;

let connection: Connection;

async function clientQuery(...args: Parameters<typeof gql>) {
  return this.query(gql(...args)).toPromise();
}

let query: null | typeof clientQuery = null;

// FIXME This is a terrible idea but until node implements fetch themselves this gon stay
if (!globalThis.fetch) {
  // @ts-ignore
  globalThis.fetch = fetch;
  // @ts-ignore
  globalThis.Headers = Headers;
  // @ts-ignore
  globalThis.Request = Request;
  // @ts-ignore
  globalThis.Response = Response;
}

if (config.discord.gql.url) {
  const client = createClient({
    url: config.discord.gql.url,
  });
  logger.info(`Connected to ${config.discord.gql.url}`);

  const q = (query = clientQuery.bind(client));

  connection = new Connection({
    ...ns,
    init: async () => q`query { status }`,
    heartbeat: () => q`query { status }`,
    close: () => {
      // No close for this type of connection
    },
  });
} else {
  connection = new NullConnection(ns, `config.discord.gql.url is missing`);
}

const cwc: typeof connection & {
  query?: typeof query;
} = connection;

export { cwc as connection, query };
