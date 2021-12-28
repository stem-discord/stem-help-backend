function Lock(obj) {
  for (const [k, v] of Object.entries(obj)) {
    if (k !== v) {
      throw new Error(
        `Type objects should have same key and value. Recieved ${k} and ${v}`
      );
    }
  }
  if (process.env.NODE_ENV === `development`) {
    return new Proxy(obj, {
      get: function (target, key) {
        if (hasOwnProperty.call(target, key)) {
          return target[key];
        }
        throw new Error(`${key} does not exist`);
      },
      set: () => {
        throw new Error(`Cannot set key for locked object`);
      },
    });
  }

  return obj;
}

export default Lock;
