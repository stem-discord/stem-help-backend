const path = require(`path`);
const dotenv = require(`dotenv`);

dotenv.config({ path: path.join(__dirname, `../../.env`) });

const env = require(`./env`);
const argv = require(`./yargs`);

const proc = require(`./process`);

let config = {...process.env};

// populate using yargs
Object.assign(config, argv);

// generate proper config
config = env(config);

// separate final validation logic
proc(config);

module.exports = config;
