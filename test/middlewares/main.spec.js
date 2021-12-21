import * as v1 from "../../src/routes/v1/index.js";
import { discord } from "../../src/service/index.js";

import * as wrapper from "./wrapper.js";

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
