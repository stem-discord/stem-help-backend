import * as util from "../../src/util/index.js";

import { expect, assert } from "chai";

import Joi from "joi";

const {
  pick,
  DSA,
  isMain,
  normalize,
  catchAsync,
  nullWrapper,
  async,
  randomIdentifier,
} = util;

import * as validations from "../../src/validations/index.js";
const { fields } = validations;
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

describe(`isMain`, function () {
  it(`should work`, function () {
    expect(() => isMain()).to.throw(/required/i);
    expect(isMain(import.meta)).to.be.false;
  });
});

describe(`normalize`, function () {
  it(`should work`, function () {
    expect(normalize(`Crème Brulée`)).to.equal(`creme brulee`);
  });
});

describe(`catchAsync`, function () {
  it(`should work`, async function () {
    const fn = async () => {
      throw new Error(`test`);
    };
    const func = chai.spy(() => {});
    const err = await catchAsync(fn)(1, 1, func);
    await expect(func).to.have.been.called();
  });
});

describe(`nullWrapper`, function () {
  it(`should work`, function () {
    expect(nullWrapper(() => {
      throw Error(`test`);
    })).to.equal(null);
    expect(nullWrapper(() => {
      return 1;
    })).to.equal(1);
  });
});

describe(`async`, function () {
  describe(`sleep.js`, function () {
    it(`should work`, async function () {
      const start = Date.now();
      await async.sleep(2);
      const end = Date.now();
      expect(end - start).to.be.least(1);
    });
  });
});

describe(`randomIdentifier.js`, function () {
  it(`should work`, function () {
    expect(randomIdentifier()).to.be.a(`string`);
    const arr = Array.from({ length: 4 }, randomIdentifier);
    // length should be the same, or it is not unique
    expect(arr.length).to.equal(new Set(arr).size);

describe(`validations`, function () {
  describe(`field`, function () {
    validationFactory(`username`, [
      `abcdsaif`,
      `the_best_cookie`,
      `the_arda_candy`,
    ], [
      `thonk me`,
      `interest-name`,
      `0best0`,
      `adoifajvaejfiajdsfjiaesjfioaewjfojasilfjaeioswfj`,
    ], fields.username);
    validationFactory(`password`, [
      `akfjioefklsdfjio123`,
      `thebestp@ssw0rd`,
    ], [
      `correcthorsebatterystaple`,
      `tooshort`,
      `12345678`,
      `!()*()#$)(#)@#)$`,
    ], fields.password);
  });
});
