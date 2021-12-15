import fetch from "node-fetch";

import env from "../config.js";
import { mongo } from "../../src/connection/index.js";
import { mock } from "../shared/index.js";

let url = env.API_URL;

const sleep = t => new Promise(r => { setTimeout(r, t); });

let local = false;

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

      local = true;

      this.timeout(20 * 1000);
      const server = await import(`../../src/server.js`);
      // eslint-disable-next-line no-console
      console.log(`Imported server. Awaiting ready signal...`);
      await server.apiServer.ready;
      // eslint-disable-next-line require-atomic-updates
      url = new URL(url);
      url.port = server.apiServer.address().port;
      url = url.toString();
    });
  it(`should return a message`, async function() {
    const res = await fetch(`${url}/test`).then(r => r.json());
    expect(res).to.be.an(`object`).with.property(`message`);
  });
  const mongoOnline = () => {
    if (!local) return;
    if (mongo.connection.null) {
      throw new Error(`Mongo connection is offline. ${mongo.connection.rejectReason}`);
    }
  };
  it(`should register user`, async function() {
    needs(this, mongoOnline);
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
    needs(this, mongoOnline);
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
  describe(`Admin John`, function() {
    before(`Login`, async function() {
      needs(this, mongoOnline);
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

      this.accessToken = res.access_token;
      this.refreshToken = res.refresh_token;
    });
    it(`Should allow him to refresh his tokens`, function() {

    });
  });
  describe(`Status`, function() {
    it(`should return the status`, async function() {
      const res = await fetch(`${url}/status`).then(r => r.json());
      expect(res).to.be.an(`object`).with.keys(`connections`, `status`);
    });
  });
  describe(`service`, function() {
    describe(`banner`, function() {
      it(`prime the headless browser`, async function() {
        this.slow(5000);
        this.timeout(10 * 1000);
        const a = () => fetch(`${url}/service/banner/html/hello`);
        const res = await a().then(v => v.arrayBuffer());
        expect(res).to.be.an.instanceof(ArrayBuffer);
        expect(res.byteLength).to.be.above(100);
      });
      it(`should return the banner (html)`, async function() {
        // Should not error
        const a = () => fetch(`${url}/service/banner/html/hello`);
        const res = await a().then(v => v.arrayBuffer());
        expect(res).to.be.an.instanceof(ArrayBuffer);
        expect(res.byteLength).to.be.above(100);
      });
    });
    describe(`banner`, function() {
      it(`should return the banner (canvas)`, async function() {
        // Should not error
        const a = () => fetch(`${url}/service/banner/canvas/hello`);
        const res = await a().then(v => v.arrayBuffer());
        expect(res).to.be.an.instanceof(ArrayBuffer);
        expect(res.byteLength).to.be.above(100);
      });
    });
    describe(`discord`, function () {
      mock(`discord`);
      it(`Should be able to fetch a user`, async function() {
        const res = await fetch(`${url}/service/discordlookup/nope`).then(r => r.json());
        expect(res).to.be.an(`array`);
      });
    });
  });
});
