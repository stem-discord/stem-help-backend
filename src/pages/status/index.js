const fs = require(`fs`);
const path = require(`path`);

module.exports = {
  statistics: fs.readFileSync(path.join(__dirname, `./statistics.ejs`)),
};
