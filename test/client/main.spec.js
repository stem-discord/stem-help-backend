// TODO: implement proper setup with proper exists with connection disconnects
import "../../src/index.js";
import config from "./config.js";
import fetch from "node-fetch";
import { expect, assert } from "chai";
const { api: url } = config;
const sleep = t => new Promise(r => { setTimeout(r, t); });

describe(`client run`, function() {
  before(async function() {
    this.timeout(0);
    // TODO: expose proper status checking api
    await sleep(10 * 1000);
  });
  it(`Basic api check`, async function() {
    const res = await fetch(`${url}/test`).then(r => r.json());
    expect(res).to.be.an(`object`).with.property(`message`);
  });
});
