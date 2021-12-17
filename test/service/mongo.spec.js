import shared from "../../src/shared/index.js";

import { mongo, openConnections } from "../../src/connection/index.js";

import { user } from "../../src/service/index.js";

describe(`mongo`, function() {
  describe(`real test`, function() {
    before(function () {
      this.needs(mongo);
    });
    it(`should find one user`, async function() {
      const user = await shared.mongo.User.findOne({
        username: `johndoe`,
      });

      expect(user).to.be.an(`object`);
    });
    it(`should find one user using getBy`, async function() {
      const u = await user.getBy.username(`johndoe`);

      expect(u).to.be.an(`object`);
    });
  });
});
