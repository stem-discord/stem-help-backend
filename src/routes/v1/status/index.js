import httpStatus from "http-status";
import fetch from "node-fetch";

import * as lib from "../../lib/index.js";

import { connections } from "../../../connection/index.js";

const { logger } = lib.tool;
const { catchAsync } = lib.util;
const { ConnectionState } = lib.types;

const router = lib.Router();

function createConnection(
  name = `Unknown`,
  state = ConnectionState.UNKNOWN,
  operational,
  meta = {}
) {
  if (!ConnectionState[state]) {
    logger.error(`Invalid connection state: ${state}`);
    state = ConnectionState.INVALID;
  }
  operational ??= state === ConnectionState.CONNECTED;
  return {
    name,
    state,
    operational,
    meta,
  };
}

function createApiStatus(status, connections) {
  if (!Array.isArray(connections)) {
    status = httpStatus[500];
    logger.error(`connections must be an array`);
  }

  if (!httpStatus[status]) {
    status = httpStatus[500];
    logger.error(`Invalid status: ${status}`);
  }

  // Should always return string codes
  status = Number.isInteger(status) ? httpStatus[status] : status;

  return {
    status,
    connections,
  };
}

function createNamespacedApiStatus(id, status, connections) {
  return {
    [id]: createApiStatus(status, connections),
  };
}

function getLocalStatus() {
  return createApiStatus(
    `OK`,
    connections.map(c => createConnection(c.name, c.state, c.isOperational()))
  );
}

router.get(`/`, (req, res) => {
  res.json(getLocalStatus());
});

/**
 * meta route to return data
 */
router.get(`/meta`, (req, res) => {
  res.json({
    metadata: {
      STEM_HELP_API_SERVER: {
        description: `STEM Help API Server that is a gateway for all API`,
        version: `1.0.0`,
      },
      STEM_SHEILD: {
        description: `A service that helps reduce spam and abuse in the community by verifying new accounts`,
        version: `1.0.0`,
      },
    },
  });
});

router.get(
  `/everything`,
  catchAsync(async (req, res) => {
    res.json({
      ...getLocalStatus(),
      ...createNamespacedApiStatus(
        `STEM_SHIELD`,
        ...(await (async () => {
          const { data } = await fetch(`https://mod.stem.help/api/status`).then(
            v => v.json()
          );

          if (data === undefined) throw new Error(`No data`);

          return [
            httpStatus.OK,
            data.map(v =>
              createConnection(
                v.name,
                {
                  online: ConnectionState.CONNECTED,
                  offline: ConnectionState.DISCONNECTED,
                }[v.status],
                v.status === `online`,
                v
              )
            ),
          ];
        })().catch(e => {
          logger.error(e);
          return [httpStatus.INTERNAL_SERVER_ERROR, []];
        }))
      ),
    });
  })
);

export default router;
