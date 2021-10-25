function Lock(obj) {
  if (process.env.NODE_ENV === `development`) {
    return new Proxy(obj, {
      get: function (target, key) {
        if (hasOwnProperty.call(target, key)) {
          return target[key];
        }
        throw new Error(`${key} does not exist`);
      },
      set: () => { throw new Error(`Cannot set key for locked object` );},
    });
  }

  return obj;
}

module.exports = Lock;
