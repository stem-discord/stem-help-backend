import express from "express";
import expressCspHeader from "express-csp-header";
import { renderFile } from "ejs";

import { dirname } from "../util/index.js";

import config from "../config/index.js";
import { Logger } from "../tool/index.js";

const logger = new Logger(`static`);
const { info } = logger;
const {
  INLINE,
  SELF,
  expressCspHeader: expressCspHeaderMiddleware,
} = expressCspHeader;
const app = express();
const base = {
  env: {
    apiURL: config.staticServerApiURL,
    // FIXME: because of this issue, two static servers cannot run at the same time
    // It is either a /static route or /
    baseURL: `http://localhost:${config.port}/static`,
  },
};

app.use(
  expressCspHeaderMiddleware({
    directives: {
      "script-src": [SELF, INLINE],
    },
  })
);

app.set(`views`, dirname(import.meta, `views`));
app.set(`view engine`, `ejs`);

// app.engine(`html`, require(`ejs`).renderFile);
app.engine(`.ejs`, renderFile);
app.get(`/test`, (req, res) => {
  info(`test page has been viewed`);
  res.render(`test`, { ...base });
});

// TODO: fix this sloppy hack
app.get(`*`, (req, res) => {
  info(`Serving default directory`);
  res.render(
    dirname(import.meta, `views`, req.path, `index.ejs`),
    { ...base },
    (err, html) => {
      if (err) {
        info(err);
        res.status(404).render(`404`);
      } else {
        res.send(html);
      }
    }
  );
});

// TODO: write as a contructor function so multiple base directories can be accepted

export default app;
