import yargs from "yargs";

const port = [`port`, `PORT`],
  staticServer = [`static-server`, `STATIC_SERVER`],
  staticServerPort = [`static-server-port`, `STATIC_SERVER_PORT`],
  staticServerApiURL = [`static-server-api-url`, `STATIC_SERVER_API_URL`],
  staticRoute = [`static-route`, `STATIC_ROUTE`],
  dbURI = [`db-uri`, `MONGODB_URL`];

// TODO refactor this
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
  .option(dbURI[0], {
    describe: `Route used by the static-server (means you can use external api server with the mini server)`,
    type: `string`,
  })
  .argv;

const arr = [port, staticServer, staticServerPort, staticServerApiURL, staticRoute, dbURI];

const opt = {};

const vk = arr.map(a => a[0]);

for(const [key, value] of arr) {
  if (vk.includes(key)) {
    opt[value] = argv[key]?.toString();
  }
}

export default opt;
