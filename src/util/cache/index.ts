import NodeCache from "node-cache";
import {
  CacheManager,
  MemoryStore,
  IndependentStoreCacheWrapper,
} from "universal-cache";

interface PlainCache<T> {
  get: (key: string, ...args: unknown[]) => T;
  set: (key: string, value: T, ...args: unknown[]) => void;
}

interface GetterCache<T> {
  get: (key: string, ...args: unknown[]) => T | Promise<T>;
}

function MemoryCache<T>(
  this: CacheManager<T>,
  options: ConstructorParameters<typeof IndependentStoreCacheWrapper>[1] = {
    ttl: `30s`,
  }
): GetterCache<T | undefined> {
  return new CacheManager<T>([
    new IndependentStoreCacheWrapper(new MemoryStore(), options),
  ]);
}

class NodeCacheIntern extends NodeCache {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  set(...args: any[]) {
    return super.set(...(args as Parameters<NodeCache[`set`]>));
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get(...args: any[]): any {
    return super.get(...(args as Parameters<NodeCache[`get`]>));
  }
}

class KeepAliveCache<T> extends NodeCacheIntern implements PlainCache<T> {
  public ttlValues: Record<string, number>;
  constructor(options?: NodeCache.Options) {
    super(options);

    this.ttlValues = Object.create(null);

    this.on(`set`, (k: string, v: number) => {
      this.ttlValues[k] = v;
    });

    this.on(`del`, (k: string) => {
      delete this.ttlValues[k];
    });
  }

  set(key: string, value: T, ttl: number) {
    this.ttlValues[key] = ttl;
    return super.set(key, value, ttl);
  }

  get(key: string) {
    super.ttl(key, this.ttlValues[key]);
    return super.get(key);
  }
}

function ProxyCache<T>(instance: PlainCache<T>) {
  instance ??= new KeepAliveCache<T>();
  return new Proxy(instance, {
    get: function (target, name) {
      return Reflect.apply(target.get, target, [name]);
    },
    set: function (target, name, value) {
      return Reflect.apply(target.set, target, [name, value]);
    },
  });
}

export { KeepAliveCache, NodeCache, ProxyCache, MemoryCache };
export type { PlainCache as __PlainCache };
