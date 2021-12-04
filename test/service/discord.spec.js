import { discord as discordConnection, openConnections } from "../../src/connection";
import { discord, stembot } from "../../src/service";
import Discord, { Collection } from "discord.js";
import { mock } from "../shared";

describe(`Service tests`, function() {

  before(async function () {
    if (discordConnection.connection.null) return;
    this.timeout(10000);
    await openConnections([`discord`]);
  });
  it(`Should be able to fetch discord users (Real test)`, function() {
    needs(this, () => discordConnection.connection.null ? `discord connection is required. ${discordConnection.connection.rejectReason}` : null);
    const res = discord.userResolveAnything(`nope#6924`);
    expect(res).to.be.an(`array`);
    expect(res).to.have.lengthOf.above(0);
    expect(res[0]).to.have.property(`id`);
  });
  describe(`Mock tests`, function() {
    mock(`discord`);
    it(`Should work with no users`, function() {
      const res = discord.userResolveAnything(`nope#6924`);
      expect(res).to.be.an(`array`);
      expect(res).to.have.lengthOf(1);
    });
  });
});

describe(`Bot test`, function() {
  it(`Should reply with hi when stemtest is said`, async function() {
    mock(`discord`);
    const msg = {
      author: {
        id: `341446613056880641`,
      },
      content: `stemtest`,
      reply: chai.spy(() => {}),
    };
    stembot.client.emit(`message`, msg);
    await expect(msg.reply).to.have.been.called.once.with(`hi`);
  });
});
