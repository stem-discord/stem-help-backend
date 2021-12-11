import * as util from "../../src/util/index.js";

import { expect, assert } from "chai";

const { pick, DSA } = util;

describe(`pick.js`, function () {
  it(`should work`, function () {
    expect(pick({ a: 1, b: 2, c: 3 }, [`a`, `b`])).to.deep.equal({ a: 1, b: 2 });
  });
});

describe(`DSA`, function () {
  describe(`lcs.js`, function () {
    const lcs = DSA.lcs;
    it(`LCSFromStart`, function () {
      const L = lcs.LCSFromStart;

      expect(L(`a`)).to.equal(1);
      expect(L(`ab`)).to.equal(2);
      expect(L(`ab`, ``)).to.equal(0);
      expect(L(`ab`, `abcde`)).to.equal(2);
      expect(L(`ab`, `bcdefa`)).to.equal(0);
      expect(L(`ab`, `abc`, `abcde`)).to.equal(2);
    });
  });
});
