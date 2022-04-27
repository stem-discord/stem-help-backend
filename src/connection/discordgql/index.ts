/* eslint-disable @typescript-eslint/ban-ts-comment */
import config from "../../config/index.js";

import { gql, createClient, OperationResult } from "@urql/core";
import fetch, { Headers, Request, Response } from "node-fetch";

import { Connection, NullConnection, Namespace } from "../connection.js";

const ns = new Namespace(
  `Discord GraphQL`,
  `Discord GraphQL client for fetching data`
);
const logger = ns.logger;

let connection: Connection;

let query:
  | null
  | ((
      ...args: Parameters<typeof gql>
    ) => Promise<OperationResult<string, object>>) = null;

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
  const noCacheClient = createClient({
    url: config.discord.gql.url,
    requestPolicy: `network-only`,
  });
  logger.info(`GraphQL server configurated to ${config.discord.gql.url}`);

  const pingStatus = async function () {
    return noCacheClient
      .query(
        gql`
          query {
            status
          }
        `
      )
      .toPromise();
  };

  const clientQuery = async function (...args: Parameters<typeof gql>) {
    return this.query(gql(...args))
      .toPromise()
      .then(v => {
        // Heartbeat injector
        if (v.data !== undefined) {
          connection.clientPing(true);
          return v;
        }
        throw new Error(`Connection error while performing a query`);
      })
      .catch(e => {
        connection.clientPing(false);
        throw e;
      });
  }.bind(client);

  query = clientQuery;

  const heartbeat = async () => {
    const res = await pingStatus();
    if (!res?.data) {
      throw new Error(`Cannot reach server`);
    }
    if (res.data?.status !== `200`) {
      throw new Error(
        `Connection is up, but the status is ${res.data?.status}`
      );
    }
  };

  connection = new Connection({
    ...ns,
    init: heartbeat,
    heartbeat,
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
