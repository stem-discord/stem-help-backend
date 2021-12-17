import path from "path";

function getCallerDir(current, skip = 1, isFile = true) {
  if (!current) throw new Error(`current file path not provided`);
  const originalFunc = Error.prepareStackTrace;
  const err = new Error();
  Error.prepareStackTrace = function (err, stack) {
    return stack;
  };
  for (let i = 0; i < skip; i++) {
    err.stack.shift();
  }
  let file = err.stack.shift().getFileName();
  while (!file || file === current) {
    file = err.stack.shift().getFileName();
  }

  Error.prepareStackTrace = originalFunc;
  return isFile ? file : path.dirname(file);
}

export default getCallerDir;
