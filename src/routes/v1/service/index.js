import discordlookup from "./discordlookup.js";
import discordidlookup from "./discordidlookup.js";
import banner from "./banner.js";
import profilebanner from "./profilebanner.js";
import badge from "./badge.js";
import dependency from "./dependency.js";
import stem from "./stem.js";
import ipEmbed from "./ip-embed.js";

import * as lib from "../../lib/index.js";

const router = lib.Router();

router.use(`/discordlookup`, discordlookup);

router.use(`/discordidlookup`, discordidlookup);

router.use(`/banner`, banner);

router.use(`/profile-banner`, profilebanner);

router.use(`/badge`, badge);

router.use(`/dependency`, dependency);

router.use(`/stem`, stem);

router.use(`/ip-embed`, ipEmbed);

export default router;
