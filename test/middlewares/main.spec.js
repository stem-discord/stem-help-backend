import Joi from "joi";

import * as v1 from "../../src/routes/v1/index.js";
import * as middlewares from "../../src/middlewares/index.js";
import { discord } from "../../src/service/index.js";

import * as wrapper from "./wrapper.js";

describe(`middlewares`, function () {
  describe(`Validate`, function () {
    it(`should throw an error if the schema is wrong`, function () {
      expect(() => middlewares.Validate({ t: `t` })).to.throw(/empty/i);
      expect(() => middlewares.Validate({ body: { t: `t` } })).to.not.throw();
    });
    it(`should properly handle with various requests`, async function () {
      const m = middlewares.Validate({
        body: {
          test: Joi.string(),
        },
      });
      await wrapper.middleware(m).next(``);
      await wrapper.middleware(m, { body: { test: 1 } }).next(``);
      await wrapper.middleware(m, { body: { test: `1` } }).next();
    });
  });
});

describe(`API endpoint controllers`, function () {
  describe(`v1`, function () {
    describe(`events`, function () {
      describe(`christmastree`, function () {
        describe(`token validations`, function () {
          const v = v1.events.tokenCheck;
          it(`should invalidate`, async function () {
            await wrapper.middleware(v).next(/missing|no/i);
            await wrapper
              .middleware(v, { body: { token: `1234` } })
              .next(/format/i);
            await wrapper
              .middleware(v, { body: { token: `1234_1234` } })
              .next(/invalid/i);
          });
          it(`should validate`, async function () {
            // Register cache
            const token = discord.createToken(`12345678`);
            await wrapper.middleware(v, { body: { token } });
          });
        });
      });
    });
  });
});
