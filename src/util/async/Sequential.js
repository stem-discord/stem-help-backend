const isProd = process.env.NODE_ENV === `production`;

function Sequential(func) {
  let current = null;
  return async function(...args) {
    const stack = isProd ? `No stack available in production` : new Error().stack;
    let thisCurrent = current;
    let resolve, reject;
    const p = new Promise((r, re) => { resolve = r; reject = re; }).catch(e => {
      e.stack += stack;
      throw e;
    });
    current = p;
    await thisCurrent?.catch(() => null);

    ((async () => {
      try {
        const a = await Reflect.apply(func, this, args);
        resolve(a);
      } catch (e) {
        reject(e);
      }
    }))();

    return p;
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
