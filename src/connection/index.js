
const { Logger } = require(`../tool`);
const logger = new Logger(`ConnectionManager`);

const connections = {
  google: require(`./google`),
  mongo: require(`./mongo`),
};


// TODO: improve this connection api
for (const [name, module] of Object.entries(connections)) {
  logger.info(`connection [${name}] - ${Object.entries(module).map(v => {
    const [name, func] = v;
    if (func.enabled) {
      return `${name}✔️ `;
    }
    return `${name} ❌`;
  }).join(`, `)}`);
}

module.exports = connections;
