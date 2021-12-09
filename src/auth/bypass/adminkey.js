import passportCustom from "passport-custom";
import passport from "passport";

import config from "../../config";

const CustomStrategy = passportCustom.Strategy;

const key = config.adminKey;

const bypassAuthenticate = passport.authenticate(new CustomStrategy(
  function(req, callback) {
    if ([req.body.key, req.headers[`x-admin-key`]].includes(key)) {
      callback(null, true);
    } else {
      callback(new Error(`No adminkey was found in body nor headers`), false);
    }
  },
));

export { bypassAuthenticate };
