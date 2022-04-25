const isProd = process.env.NODE_ENV === `production`;

function Sequential<T>(func: (...args: unknown[]) => Promise<T>) {
  let current: Promise<T> | null = null;
  return async function (...args) {
    const stack = isProd
      ? `No stack available in production`
      : new Error().stack;
    const thisCurrent = current;

    await thisCurrent?.catch(() => null);

    // eslint-disable-next-line require-atomic-updates
    return (current = Reflect.apply(func, this, args)
      .then()
      .catch((e: Error) => {
        e.stack += `\n\n-- Sequential Function created at\n` + stack;
        throw e;
      }));
  };
}

// (async function() {
//   async function someAsyncInner(a) {
//     console.log(`starting ${a}...`);
//     await sleep(1000);
//     console.log(`done! ${a}`);
//     throw new Error(`${a} failed!`);
//   }

//   const someAsync = new Sequential(someAsyncInner);

//   someAsync(`inky`).catch(e => console.log(e));
//   someAsync(`pinky`).catch(e => console.log(e));
//   someAsync(`blinky`).catch(e => console.log(e));
// })();

export default Sequential;
