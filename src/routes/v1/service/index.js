import discordlookup from "./discordlookup.js";

import banner from "./banner.js";

import * as lib from "../../lib/index.js";

const router = lib.Router();

router.use(`/discordlookup`, discordlookup);

router.use(`/banner`, banner);

export default router;
