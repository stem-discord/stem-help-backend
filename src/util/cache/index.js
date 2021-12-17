import NodeCache from "node-cache";

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

export { KeepAliveCache, NodeCache };
