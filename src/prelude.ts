/* eslint-disable @typescript-eslint/ban-ts-comment */
import fetch, { Headers, Request, Response } from "node-fetch";

export type Promise<A> = globalThis.Promise<
  A extends globalThis.Promise<infer X> ? X : A
>;

// @ts-ignore
globalThis.fetch = fetch;
// @ts-ignore
globalThis.Headers = Headers;
// @ts-ignore
globalThis.Request = Request;
// @ts-ignore
globalThis.Response = Response;
