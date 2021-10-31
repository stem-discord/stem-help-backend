import * as util from "../../src/util";

import { expect, assert } from "chai";

const { pick } = util;

describe(`pick.js`, function () {
  it(`should work`, function () {
    expect(pick({ a: 1, b: 2, c: 3 }, [`a`, `b`])).to.deep.equal({ a: 1, b: 2 });
  });
});
