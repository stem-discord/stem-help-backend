import discordlookup from "./discordlookup.js";

import * as lib from "../../lib/index.js";

const router = lib.Router();

router.use(`/discordlookup`, discordlookup);

export default router;
