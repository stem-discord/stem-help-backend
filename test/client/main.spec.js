import config from "./config.js";
import fetch from "node-fetch";
import { expect, assert } from "chai";
const { api: url } = config;
const sleep = t => new Promise(r => { setTimeout(r, t); });

describe(`client run`, function() {
  if (!config.onlyClient) before(async function() {
    this.timeout(0);
    // TODO: expose proper status checking api
    const index = await import(`../../src`);
    const server = await import(`../../src/server.js`);
    await index.connection.openConnections;
    await server.ready;
  });
  it(`should return a message`, async function() {
    const res = await fetch(`${url}/test`).then(r => r.json());
    expect(res).to.be.an(`object`).with.property(`message`);
  });
  it(`should register user`, async function() {
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
  it(`should let monk log in`, async function() {
    const res = await fetch(`${url}/auth/login`, {
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
  it(`should let john the admin log in`, async function() {
    const res = await fetch(`${url}/auth/login`, {
      method: `POST`,
      headers: {
        "Content-Type": `application/json`,
      },
      body: JSON.stringify({
        username: `johndoe`,
        password: `password1`,
      }),
    }).then(r => r.json());
    expect(res).to.be.an(`object`).include.all.keys(`access_token`, `refresh_token`);
  });
});
