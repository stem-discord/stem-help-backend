
const { logger } = require(`../tool`);

const connections = {
  google: require(`./google`),
  mongo: require(`./mongo`),
};


// TODO: improve this connection api
for (const [name, module] of Object.entries(connections)) {
  logger.info(`connection [${name}] - ${Object.entries(module).map((k, v) => {
    if (v.enabled) {
      return `${k} ✔️`;
    }
    return `${k} ❌`;
  }).join(`, `)}`);
}

module.exports = connections;
