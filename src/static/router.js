const express = require(`express`);
const { config, logger } = require(`../config`);

const app = express();

const base = {
  apiURL: config.apiURL ?? `http://localhost:${config.port}/v1/`,
};

app.set(`view engine`, `ejs`);

app
  .route(`/`)
  .get((req, res) => {
    res.render(`index`, {base});
  });

app.use(express.static(`./`));


module.exports = app;