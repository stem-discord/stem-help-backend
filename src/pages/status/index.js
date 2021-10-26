const fs = require(`fs`);

module.exports = {
  statistics: fs.readFileSync(`./statistics`),
};
