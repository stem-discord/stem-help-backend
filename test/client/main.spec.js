import fetch from "node-fetch";

import env from "../config.js";

let url = env.API_URL;

const sleep = t => new Promise(r => { setTimeout(r, t); });

describe(`client run`, function() {
  if (url.match(/^https?:\/\/localhost/))
    before(async function() {
      const isOnline = await fetch(`${url}`).catch(() => false);
      if (!isOnline) {
      // eslint-disable-next-line no-console
        console.log(`Server is not running (), and url was a local host. creating local server...`);
      } else {
        return;
      }

      this.timeout(20 * 1000);
      const server = await import(`../../src/server.js`);
      await server.ready;
      // eslint-disable-next-line require-atomic-updates
      url = new URL(url);
      url.port = server.apiServer.address().port;
      url = url.toString();
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
