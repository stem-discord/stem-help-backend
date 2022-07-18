/* eslint-disable @typescript-eslint/ban-ts-comment */
import config from "../../config/index.js";

import { Octokit } from "@octokit/rest";
import { createAppAuth } from "@octokit/auth-app";

import { Connection, NullConnection, Namespace } from "../connection.js";

const ns = new Namespace(
  `GitApp`,
  `GitApp for interacting with the GitApp API.`
);

const logger = ns.logger;

let connection: Connection;

let octokit: Octokit | undefined = undefined;

if (config.github.issues.appId) {
  const { appId, rsaKey, installationId } = config.github.issues;

  logger.info(
    `GitApp initialized with id: ${appId} installation id: ${installationId}`
  );

  octokit = new Octokit({
    authStrategy: createAppAuth,
    auth: {
      appId,
      privateKey: rsaKey,
      installationId,
    },
  });

  connection = new Connection({
    ...ns,
    init: () => true,
    heartbeat: () => true,
    close: () => {
      // No close for this type of connection
    },
  });
} else {
  connection = new NullConnection(ns, `config.github.issues is missing`);
}

const cwc: typeof connection & {
  octokit?: typeof octokit;
} = connection;

if (octokit) {
  cwc.octokit = octokit;
}

export { cwc as connection, octokit };
