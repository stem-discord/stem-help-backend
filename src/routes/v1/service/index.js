import discordlookup from "./discordlookup.js";
import discordidlookup from "./discordidlookup.js";
import banner from "./banner.js";
import badge from "./badge.js";
import dependency from "./dependency.js";
import stem from "./stem.js";

import * as lib from "../../lib/index.js";

const router = lib.Router();

router.use(`/discordlookup`, discordlookup);

router.use(`/discordidlookup`, discordidlookup);

router.use(`/banner`, banner);

router.use(`/badge`, badge);

router.use(`/dependency`, dependency);

router.use(`/stem`, stem);

export default router;
