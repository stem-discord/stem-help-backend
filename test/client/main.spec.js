// TODO: implement proper setup with proper exists with connection disconnects
if (!process.env.ONLY_CLIENT) import(`../../src/index.js`);
import config from "./config.js";
import fetch from "node-fetch";
import { expect, assert } from "chai";
const { api: url } = config;
const sleep = t => new Promise(r => { setTimeout(r, t); });

describe(`client run`, function() {
  if (!process.env.ONLY_CLIENT) before(async function() {
    this.timeout(0);
    // TODO: expose proper status checking api
    await sleep(10 * 1000);
  });
  it(`Basic api check`, async function() {
    const res = await fetch(`${url}/test`).then(r => r.json());
    expect(res).to.be.an(`object`).with.property(`message`);
  });
  it(`Register user`, async function() {
    const res = await fetch(`${url}/auth/register`, {
      method: `POST`,
      headers: {
        "Content-Type": `application/json`,
      },
      body: JSON.stringify({
        username: `the_monk`,
        password: `testa09gakj3f!`,
      }),
    }).then(r => r.json());
    expect(res).to.be.an(`object`).include.all.keys(`access_token`, `refresh_token`);
  });
});
