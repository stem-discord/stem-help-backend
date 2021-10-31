import yargs from "yargs";

const port = [`port`, `PORT`],
  staticServer = [`static-server`, `STATIC_SERVER`],
  staticServerPort = [`static-server-port`, `STATIC_SERVER_PORT`],
  staticServerApiURL = [`static-server-api-url`, `STATIC_SERVER_API_URL`],
  staticRoute = [`static-route`, `STATIC_ROUTE`],
  dropAll = [`drop-all`, `MONGODB_DROP_ALL`];

// TODO: finish this
const argv = yargs
// accept port number as argument
  .option(port[0], {
    alias: `p`,
    describe: `Port number`,
    type: `number`,
  })

  // == STATIC SERVER ==
  .option(staticServer[0], {
    alias: `s`,
    describe: `Serve separate web app for static`,
    type: `boolean`,
  })
  .option(staticServerPort[0], {
    describe: `Serve static in api route`,
    type: `number`,
  })
  .option(staticServerApiURL[0], {
    describe: `Port number`,
    type: `number`,
  })
  .option(staticRoute[0], {
    alias: `p`,
    describe: `Route used by the static-server (means you can use external api server with the mini server)`,
    type: `string`,
  })
  .option(dropAll[0], {
    alias: `D`,
    describe: `deletes all collections in database for testing purposes`,
    type: `boolean`,
  })
  .argv;

const arr = [port, staticServer, staticServerPort, staticServerApiURL, staticRoute, dropAll];

const opt = {};

const vk = arr.map(a => a[0]);

for(const [key, value] of arr) {
  if (vk.includes(key)) {
    opt[value] = argv[key]?.toString();
  }
}

console.log(opt);

export default opt;
