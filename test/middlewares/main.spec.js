import * as v1 from "../../src/routes/v1/index.js";
import { discord } from "../../src/service/index.js";

import * as wrapper from "./wrapper.js";

import { request } from "express";

describe(`v1`, function () {
  describe(`events`, function () {
    describe(`christmastree`, function () {
      describe(`token validations`, function () {
        it(`should invalidate`, async function () {
          await wrapper.middleware(v1.events.tokenCheck).next(/invalid token/i);
        });
        it(`should validate`, async function () {
          // Register cache
          const next = chai.spy();
          const token = discord.createToken(`12345678`);
          await v1.events.tokenCheck(Object.create(request), null, next);
          expect(next).to.have.been.called();
        });
      });
    });
  });
});
