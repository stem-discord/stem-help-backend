import NodeCache from "node-cache";
import fsc from "file-system-cache";

const fscDefault = fsc.default;

class FileSystemCache extends fscDefault {
  /**
   * transformer should be sync if you intend to use getSync
   */
  constructor(opts = {}) {
    if (opts.ns === undefined) {
      throw new Error(`FileSystemCache: 'ns' is required`);
    }
    super(opts);
    this.transformer = opts.transformer ?? (v => v);
  }

  get(key, defaultValue) {
    return super.get(key, defaultValue).then(v => v && this.transformer(v));
  }

  getSync(key, defaultValue) {
    return this.transformer(super.getSync(key, defaultValue));
  }
}

class KeepAliveCache extends NodeCache {
  constructor(options) {
    super(options);

    this.ttlValues = Object.create(null);

    this.on(`set`, (k, v) => {
      this.ttlValues[k] = v;
    });

    this.on(`del`, k => {
      delete this.ttlValues[k];
    });
  }

  set(key, value, ttl) {
    this.ttlValues[key] = ttl;
    return super.set(key, value, ttl);
  }

  get(key) {
    super.ttl(key, this.ttlValues[key]);
    return super.get(key);
  }
}

function ProxyCache(instance) {
  instance ??= new NodeCache();
  return new Proxy(instance, {
    get: function (target, name) {
      return Reflect.apply(target.get, target, [name]);
    },
    set: function (target, name, value) {
      return Reflect.apply(target.set, target, [name, value]);
    },
  });
}

export { KeepAliveCache, NodeCache, ProxyCache, FileSystemCache };
