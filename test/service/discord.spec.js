import { openConnections } from "../../src/connection";
import { discord } from "../../src/service";
import Discord, { Collection } from "discord.js";
import { mock } from "../shared";

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
    mock([`discord`]);
    it(`Should work with no users`, function() {
      const res = discord.userResolveAnything(`nope#6924`);
      expect(res).to.be.an(`array`);
      expect(res).to.have.lengthOf(1);
    });
  });
});
