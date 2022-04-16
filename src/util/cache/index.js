import NodeCache from "node-cache";
import * as NopeFSCache from "nope-fs-cache";

// This class just works fine
class FileSystemCache extends NopeFSCache.FileSystemCacheDelux {}

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
