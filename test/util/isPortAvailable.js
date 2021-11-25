import net from 'net';

const server = net.createServer();

export default function (port) {
  let resolve;
  server.once(`error`, function(err) {
    if (err.code === `EADDRINUSE`) resolve(false);
  });

  server.once(`listening`, function() {
    // close the server if listening doesn't fail
    server.close(err => {
      if (err) throw err;
    });
  });

  server.on(`close`, () => {
    resolve(true);
  });

  server.listen(port);

  return new Promise(r => {
    resolve = r;
  });
}
