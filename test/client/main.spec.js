import fetch from "node-fetch";
import jwt_decode from "jwt-decode";

import env from "../config.js";
import { mongo } from "../../src/connection/index.js";
import { mock } from "../shared/index.js";


import * as i from "./interface.js";

let url = env.API_URL;

const sleep = t => new Promise(r => { setTimeout(r, t); });

function tokenPair(obj) {
  const { access_token, refresh_token } = obj;
  return {
    access: access_token && jwt_decode(access_token),
    refresh: refresh_token && jwt_decode(refresh_token),
  };
}

function validateAccessToken(token) {
  expect(token.user).to.include.keys([`ranks`, `groups`]);
  expect(token.user).to.not.include.keys([`email`]);
}

describe(`client run`, function() {
  before(`check if server is online`, async function() {
    const isOnline = await fetch(`${url}`).catch(() => false);
    if (!isOnline) {
    // eslint-disable-next-line no-console
      console.log(`Server is not running, and url was a local host. creating local server...`);
    } else {
      return;
    }

    env.local = true;

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

  describe(`status check`, function() {
    it(`should return a message`, async function() {
      const res = await fetch(`${url}/status`).then(r => r.json());
      expect(res).to.be.an(`object`).to.include.keys(`status`, `connections`);
      for (const o of res.connections) {
        expect(o).to.include.keys(`name`, `state`, `operational`);
      }
    });
  });

  describe(`auth cycle`, function() {
    describe(`monk (normal user)`, function() {
      before(function() {
        this.needs(mongo);
      });

      let access_token, refresh_token;

      it(`should register a user`, async function() {
        const res = await i.register(`monk`, `monk1234`, {
          email: `monk@gmail.com`,
        });
        expect(res).to.be.an(`object`).with.keys(
          `access_token`,
          `refresh_token`,
          `user`,
        );
        const { access, refresh } = tokenPair(res);
        expect(access.user).to.include.keys([`ranks`, `groups`]);
        expect(access.user).to.not.include.keys([`email`]);

        access_token = res.access_token;
        refresh_token = res.refresh_token;
      });

      it(`monk should be able to login again`, async function() {
        const res = await i.login(`monk`, `monk1234`);
        expect(res).to.be.an(`object`).with.keys(
          `access_token`,
          `refresh_token`,
          `user`,
        );
        const { access, refresh } = tokenPair(res);
        validateAccessToken(access);
      });

      it(`monk should be able to refresh his tokens`, async function() {
        const res = await i.refresh(refresh_token);
        expect(res).to.be.an(`object`).with.keys(
          `access_token`,
        );
        const { access } = tokenPair(res);

        validateAccessToken(access);
      });

      it(`should allow logout`);
    });
    describe(`john (admin user)`, function() {
      before(function() {
        this.needs(mongo);
      });

      let access_token, refresh_token;

      it(`should allow login`, async function() {

        const res = await i.login(`johndoe`, `password1`);
        expect(res).to.be.an(`object`).with.keys(
          `access_token`,
          `refresh_token`,
          `user`,
        );
        ({ access_token, refresh_token } = res);
        const { access, refresh } = tokenPair(res);
        validateAccessToken(access);
      });
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
