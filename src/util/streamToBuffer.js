// https://stackoverflow.com/questions/14269233/node-js-how-to-read-a-stream-into-a-buffer
function streamToBuffer(stream) {

  return new Promise((resolve, reject) => {

    const _buf = [];

    stream.on(`data`, (chunk) => _buf.push(chunk));
    stream.on(`end`, () => resolve(Buffer.concat(_buf)));
    stream.on(`error`, (err) => reject(err));

  });
}

export default streamToBuffer;
