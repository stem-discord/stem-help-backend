import * as lib from "../../lib/index.js";

import { connections } from "../../../connection/index.js";

const router = lib.Router();

router.get(`/`, (req, res) => {
  res.json({
    status: `ok`,
    connections: connections.map(connection => ({
      name: connection.name,
      state: connection.state,
      operational: connection.isOperational(),
    })),
  });
});

export default router;
