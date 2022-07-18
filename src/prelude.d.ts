import fetch, { Headers, Request, Response } from "node-fetch";

export type Promise<A> = globalThis.Promise<
  A extends globalThis.Promise<infer X> ? X : A
>;

globalThis.fetch = fetch;
globalThis.Headers = Headers;
globalThis.Request = Request;
globalThis.Response = Response;
