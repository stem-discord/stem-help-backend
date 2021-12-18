import {
  discord as discordConnection,
  openConnections,
} from "../../src/connection/index.js";
import { discord, stembot } from "../../src/service/index.js";
import Discord, { Collection } from "discord.js";
import { mock } from "../shared/index.js";

describe(`Service tests`, function () {
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

// TODO have proper mocks
describe(`Bot test mock`, function () {
  mock(`discord`);
  it(`Should reply with hi when stemtest is said`, async function () {
    const msg = {
      author: {
        id: `341446613056880641`,
      },
      content: `stemtest`,
      reply: chai.spy(() => {}),
      guild: { id: `493173110799859713` },
    };
    stembot.client.emit(`messageCreate`, msg);
    await expect(msg.reply).to.have.been.called.once.with(`hi`);
  });
  it(`Should give zen role when give me role is said`, async function () {
    const msg = {
      author: {
        id: `341446613056880641`,
      },
      content: `give me zen`,
      guild: {
        id: `493173110799859713`,
      },
      member: {
        roles: {
          add: chai.spy(() => {}),
        },
      },
    };
    await stembot.client.emit(`messageCreate`, msg);
    await expect(msg.member.roles.add).to.have.been.called.once.with(
      `882261053793239061`
    );
  });
});

describe(`Generate token`, function () {
  it(`Should generate a token`, function () {
    const token = discord.createToken(`341446613056880641`);
    expect(token).to.be.a(`string`);
    expect(token).to.match(/^\d+-[\da-f]+$/);
  });
});
