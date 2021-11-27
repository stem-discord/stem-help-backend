import { openConnections } from "../../src/connection";
import { discord } from "../../src/service";
import Discord, { Collection } from "discord.js";

describe(`Service tests`, function() {
  before(async function () {
    this.timeout(10000);
    await openConnections([`discord`]);
  });
  it(`Should be able to fetch discord users (Real test)`, function() {
    const res = discord.userResolveAnything(`nope#6924`);
    expect(res).to.be.an(`array`);
    expect(res).to.have.lengthOf.above(0);
    expect(res[0]).to.have.property(`id`);
  });
  describe(`Mock tests`, function() {
    // TODO expose this to service folder context
    const mockShared = {
      discord: {
        stem: {
          guild: {
            members: {
              // This is stupid
              resolve(m) { return { nickname: `Satan`, ...m }; },
            },
          },
        },
        client: {
          users: {
            cache: new Collection(
              [
                [
                  `220327217312432129`,
                  {
                    id: `220327217312432129`,
                    username: `nope`,
                    discriminator: `6924`,
                  },
                ],
              ]),
          },
        },
      },
    };
    it(`Should work with no users`, function() {
      const res = Reflect.apply(discord.userResolveAnything, mockShared, [`nope#6924`]);
      expect(res).to.be.an(`array`);
      expect(res).to.have.lengthOf(1);
    });
  });
});
