const fs = require(`fs`);

module.exports = {
  misconfiguration: fs.readFileSync(`./misconfiguration.ejs`),
};
