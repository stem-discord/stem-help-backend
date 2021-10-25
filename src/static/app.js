const express = require(`express`);
const path = require(`path`);

const config = require(`../config`);
const { Logger } = require(`../tool`);
const logger = new Logger(`static`);
const { info } = logger;

const app = express();

const base = {
  env: {
    apiURL: config.apiURL ?? `http://localhost:${config.port}/v1`,
    // FIXME: because of this issue, two static servers cannot run at the same time
    // It is either a /static route or /
    baseURL: `http://localhost:${config.port}/static`,
  },
};

app.set(`views`, path.join(__dirname, `views`));
app.set(`view engine`, `ejs`);

// app.engine(`html`, require(`ejs`).renderFile);
app.engine(`.ejs`, require(`ejs`).renderFile);


app
  .get(`/test`, (req, res) => {
    info(`test page has been viewed`);
    res.render(`test`, { ...base });
  });

// TODO: fix this sloppy hack
app.get(`*`, (req, res) => {
  info(`Serving default directory`);
  res.render(path.join(__dirname, `views`, req.path, `index.ejs`), { ...base }, (err, html) => {
    if (err) {
      info(err);
      res.status(404).render(`404`);
    } else {
      res.send(html);
    }
  });
});

// TODO: write as a contructor function so multiple base directories can be accepted

module.exports = app;
