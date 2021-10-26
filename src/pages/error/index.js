const fs = require(`fs`);
const path = require(`path`);

module.exports = {
  misconfiguration: fs.readFileSync(path.join(__dirname, `./misconfiguration.ejs`), `utf8`),
};
