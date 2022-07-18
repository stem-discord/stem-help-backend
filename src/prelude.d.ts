export type Promise<A> = globalThis.Promise<
  A extends globalThis.Promise<infer X> ? X : A
>;
