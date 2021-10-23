// recieve configurations from command line arguments
const yargs = require(`yargs`);

const
  port = [`port`, `p`], 
  staticServer = [`static-server`, `STATIC_SERVER`],
  staticServerPort = [`static-server-port`, `STATIC_SERVER_PORT`],
  staticServerApiURL = [`static-server=api-url`, `STATIC_SERVER_API_URL`],
  staticRoute = [`static-route`, `STATIC_ROUTE`];

// TODO: finish this
const argv = yargs
// accept port number as argument
  .option(port[0], {
    alias: `p`,
    default: 3000,
    describe: `Port number`,
    type: `number`,
  })

  // == STATIC SERVER ==
  .option(staticServer[0], {
    alias: `s`,
    default: false,
    describe: `Serve separate web app for static`,
    type: `boolean`,
  })
  .option(staticServerPort[0], {
    default: false,
    describe: `Serve static in api route`,
    type: `boolean`,
  })
  .option(staticServerApiURL[0], {
    describe: `Port number`,
    type: `number`,
  })
  .option(staticRoute, {
    alias: `p`,
    describe: `Route used by the static-server (means you can use external api server with the mini server)`,
    type: `string`,
  })
  .argv;

module.exports = argv;
