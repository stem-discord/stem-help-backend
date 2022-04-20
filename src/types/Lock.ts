function Lock<T extends Record<string, unknown>>(obj: T) {
  if (Object.keys(obj).length === 0) {
    throw new Error(`obj must not be empty`);
  }
  for (const [k, v] of Object.entries(obj)) {
    if (k !== v) {
      throw new Error(
        `Type objects should have same key and value. Recieved ${k} and ${v}`
      );
    }
  }
  if (process.env.NODE_ENV !== `production`) {
    return new Proxy(obj, {
      get: function (target, key) {
        if (typeof key === `symbol`) return true;

        if (Object.hasOwnProperty.call(target, key)) {
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
