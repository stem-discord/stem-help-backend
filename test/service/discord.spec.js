import fetch from "node-fetch";
import chai from "chai";

import {
  discord as discordConnection,
  openConnections,
} from "../../src/connection/index.js";
import { discord, stembot } from "../../src/service/index.js";
import Discord, { Collection } from "discord.js";
import { mock } from "../shared/index.js";
import _ from "lodash";
import { format } from "util";
import config from "../../src/config/index.js";

function f() {
  return chai.spy(() => Promise.resolve(this));
}

/**
 * opts will merge the properties with message, but
 * if opts.message is specified, you have to put every message options under .message
 */
function MockMessage(msg, opts = {}) {
  return _.merge(
    Object.create(null),
    {
      author: {
        id: `341446613056880641`,
        username: `nope`,
        discriminator: `6924`,
      },
      content: msg,
      delete: f(),
      reply: f(),
      channel: {
        send: f(),
      },
      guild: {
        id: config.discord.server.stem,
      },
      member: {
        roles: {
          add: f(),
        },
      },
    },
    opts.message ?? opts
  );
}

async function SendMockMessage(msg, opts) {
  const message = MockMessage(msg, opts);
  await stembot.client.emitPromise(`messageCreate`, message);
  return message;
}

async function SendMockMessageCalled(msg, opts, param) {
  const message = await SendMockMessage(msg, opts);
  expect(message.reply).to.have.been.called.once.with(param);
  return message;
}

describe(`Service tests`, function () {
  describe(`uploadFile`, function () {
    this.slow(4000);
    this.timeout(5000);
    before(function () {
      this.needs(() => {
        if (config.discord.uploadWebhook) {
          return null;
        }
        return new Error(`uploadwebhook is not set`);
      });
    });
    it(`should upload a string`, async function () {
      const str = `teststring`;
      const url = await discord.uploadFile(str, { filename: `hi.txt` });
      expect(url).to.be.a.string;
      expect(await fetch(url).then(v => v.text())).to.equal(str);
    });
    it(`should upload a buffer`, async function () {
      const str = `teststring`;
      const buf = Buffer.from(str);
      buf.filename = `hi.txt`;
      const url = await discord.uploadFile(buf);
      expect(url).to.be.a.string;
      expect(await fetch(url).then(v => v.text())).to.equal(str);
    });
  });
  describe(`real`, function () {
    before(function () {
      this.needs(discordConnection);
    });
    it(`Should be able to fetch discord users (Real test)`, function () {
      const res = discord.userResolveAnything(`nope#6924`);
      expect(res).to.be.an(`array`);
      expect(res).to.have.lengthOf.above(0);
      expect(res[0]).to.have.property(`id`);
    });
  });
  describe(`Mock tests`, function () {
    mock(`discord`);
    it(`Should work with no users`, function () {
      const res = discord.userResolveAnything(`nope#6924`);
      expect(res).to.be.an(`array`);
      expect(res).to.have.lengthOf(1);
    });
  });
});

describe(`Bot test mock`, function () {
  mock(`discord`);
  it(`Should reply with hi when stemtest is said`, async function () {
    await SendMockMessageCalled(
      `stemtest`,
      {
        author: { id: `341446613056880641` },
      },
      `hi`
    );
  });
  it(`Should give zen role when give me role is said`, async function () {
    const msg = await SendMockMessage(`give me zen`);
    expect(msg.member.roles.add).to.have.been.called.once.with(
      `882261053793239061`
    );
  });
  it(`trigger stats - no timeout`, async function () {
    this.timeout(10000);
    this.slow(5000);
    await SendMockMessage(`stemapi stats`, {
      author: {
        id: `341446613056880641`,
      },
    });
  });
  it(`trigger stats`, async function () {
    let valid, arg;
    await SendMockMessage(`stemapi stats`, {
      author: {
        id: `341446613056880641`,
      },
      reply: chai.spy(v => {
        arg = v;
        valid = !!v.match(/branch/i);
      }),
    });
    expect(valid, `validator was not satisfied. Reply was ${arg}`).to.be.true;
  });
});

describe(`Generate token`, function () {
  it(`Should generate a token`, function () {
    const token = discord.createToken(`341446613056880641`);
    expect(token).to.be.a(`string`);
    expect(token).to.match(/^\d+_[\da-f]+$/);
  });
});
