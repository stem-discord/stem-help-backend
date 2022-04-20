/* eslint-disable @typescript-eslint/ban-ts-comment */

import path from "path";

/**
 * Honestly I don't know how exactly this works, but unit tests are passing so...
 * Just leave it be
 */

/**
 * Returns the directory name of the provided path, from which the function is called.
 * @param current The provided path.
 * @param skip The number of levels/dirs in the path to skip.
 * @param isFile A boolean of whether the path ends with a filename.
 */
function getCallerDir(current: string, skip = 1, isFile = true) {
  if (current === undefined) throw new Error(`current file path not provided`);
  const originalFunc = Error.prepareStackTrace;
  const err = new Error();
  Error.prepareStackTrace = function (_err, stack) {
    return stack;
  };
  for (let i = 0; i < skip; i++) {
    // @ts-ignore
    err.stack.shift();
  }
  // @ts-ignore
  let file = err.stack.shift().getFileName();
  while (!file || file === current) {
    // @ts-ignore
    file = err.stack.shift().getFileName();
  }

  Error.prepareStackTrace = originalFunc;
  return isFile ? file : path.dirname(file);
}

export default getCallerDir;
