import * as util from "../../src/util/index.js";
import * as types from "../../src/types/index.js";

import Joi from "joi";

import * as validations from "../../src/validations/index.js";
const { fields, discord } = validations;

// https://stackoverflow.com/questions/5717093/check-if-a-javascript-string-is-a-url
function isValidHttpUrl(string) {
  let url;

  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }

  return url.protocol === `http:` || url.protocol === `https:`;
}

describe(`types`, function () {
  describe(`Lock.js`, function () {
    it(`should throw an error on invalid configs`, function () {
      expect(() => types.Lock({})).to.throw(/empty/i);
      expect(() => types.Lock({ name: `test` })).to.throw(/same/i);
      expect(() => types.Lock({ name: `test`, timeout: `test` })).to.throw(
        /same/i
      );
      expect(() => types.Lock({ name: `test`, timeout: 1 })).to.throw(/same/i);

      // Should work
      expect(() =>
        types.Lock({ name: `name`, timeout: `timeout` })
      ).to.not.throw();
    });

    it(`should not throw an error on valid configs`, function () {
      // Should work
      expect(() =>
        types.Lock({ name: `name`, timeout: `timeout` })
      ).to.not.throw();
    });

    describe(`production`, function () {
      let env;
      before(() => {
        env = process.env.NODE_ENV;
        process.env.NODE_ENV = `production`;
      });
      after(() => {
        process.env.NODE_ENV = env;
      });

      it(`should not throw an error when accessing objects`, function () {
        const t = types.Lock({ name: `name`, timeout: `timeout` });
        expect(() => t[`test`]).to.not.throw();
      });
    });

    describe(`non-production`, function () {
      it(`should throw an error when accessing objects`, function () {
        const t = types.Lock({ name: `name`, timeout: `timeout` });
        expect(() => t[`test`]).to.throw();
      });
    });
  });
});

describe(`util`, function () {
  it(`pick.js`, function () {
    expect(util.pick({ a: 1, b: 2, c: 3 }, [`a`, `b`])).to.deep.equal({
      a: 1,
      b: 2,
    });
  });

  it(`getCallerDir.js`, function () {
    expect(() => util.getCallerDir()).to.throw(`not provided`);
    // No filepath can't be equal to symbol. So, this file path should return the current file path
    expect(util.getCallerDir(``)).to.equal(import.meta.url);
    console.log(util.getCallerDir({}, 1, false));
    expect(import.meta.url).to.startWith(util.getCallerDir({}, 1, false));
  });

  describe(`time`, function () {
    it(`startTime`, function () {
      // This isn't a great test, only for coverage really
      expect(util.time.startTime()).to.match(/00:\d\d:\d\d/);
      expect(util.time.startTime(Date.now())).to.match(/00:\d\d:\d\d/);
    });
    it(`localeTime`, function () {
      expect(util.time.localeTime()).to.match(/\d\d:\d\d:\d\d/);
      expect(util.time.localeTime(Date.now())).to.match(/\d\d:\d\d:\d\d/);
    });
  });

  describe(`DSA`, function () {
    describe(`lcs.js`, function () {
      const lcs = util.DSA.lcs;
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
      expect(() => util.isMain()).to.throw(/required/i);
      expect(util.isMain(import.meta)).to.be.false;
    });
  });

  describe(`normalize`, function () {
    it(`should work`, function () {
      expect(util.normalize(`Crème Brulée`)).to.equal(`creme brulee`);
    });
  });

  describe(`catchAsync`, function () {
    it(`should work`, async function () {
      const fn = async () => {
        throw new Error(`test`);
      };
      const func = chai.spy(() => {});
      await util.catchAsync(fn)(1, 1, func);
      await expect(func).to.have.been.called();
    });
  });

  describe(`nullWrapper`, function () {
    it(`should work`, function () {
      expect(
        util.nullWrapper(() => {
          throw Error(`test`);
        })
      ).to.equal(null);
      expect(
        util.nullWrapper(() => {
          return 1;
        })
      ).to.equal(1);
    });
  });

  describe(`async`, function () {
    describe(`sleep.js`, function () {
      it(`should work`, async function () {
        const start = Date.now();
        await util.async.sleep(2);
        const end = Date.now();
        expect(end - start).to.be.least(1);
      });
    });
  });

  describe(`discord`, function () {
    describe(`oauth`, function () {
      it(`should throw errors`, function () {
        expect(() => util.discord.oauth.buildUri()).to.throw(/required/i);
        expect(() => util.discord.oauth.buildUri(1)).to.throw(/required/i);
      });
      it(`should work`, function () {
        expect(util.discord.oauth.buildUri(1, 2)).to.be.a(`string`);
        expect(isValidHttpUrl(util.discord.oauth.buildUri(1, 2))).to.be.true;
        expect(() => util.discord.oauth.buildUri(1, 2)).to.not.throw();
      });
    });
  });

  describe(`http`, function () {
    describe(`status`, function () {
      describe(`isOperational`, function () {
        it(`should work`, function () {
          expect(() => util.http.status.isOperational()).to.throw(/required/i);
          expect(() => util.http.status.isOperational({})).to.throw();
          expect(() => util.http.status.isOperational(`test`)).to.throw(
            /integer/i
          );
          expect(util.http.status.isOperational(`200`)).to.be.true;
          expect(util.http.status.isOperational(`201`)).to.be.true;
          expect(util.http.status.isOperational(`300`)).to.be.false;
        });
      });
      describe(`getDescription`, function () {
        it(`should work`, function () {
          expect(() => util.http.status.getDescription()).to.throw(/required/i);
          expect(() => util.http.status.getDescription(`test`)).to.throw(
            /invalid/i
          );
          expect(util.http.status.getDescription(`BAD_REQUEST`)).to.equal(400);
          expect(util.http.status.getDescription(404)).to.equal(`Not Found`);
        });
      });
    });
  });

  describe(`randomIdentifier.js`, function () {
    it(`should work`, function () {
      expect(util.randomIdentifier()).to.be.a(`string`);
      const arr = Array.from({ length: 4 }, util.randomIdentifier);
      // length should be the same, or it is not unique
      expect(arr.length).to.equal(new Set(arr).size);
    });
  });
});

function validationFactory(fieldname, passing, failing, validator) {
  describe(`validation for ${fieldname}`, function () {
    describe(`Should pass passing usernames`, function () {
      for (const pass of passing) {
        it(`${pass}`, function () {
          expect(
            Joi.string().custom(validator).validate(pass),
            `expected '${pass}' to be a valid ${fieldname}`
          ).to.not.have.property(`error`);
        });
      }
    });
    describe(`Should not pass invalid usernames`, function () {
      for (const fail of failing) {
        it(`${fail}`, function () {
          expect(
            Joi.string().custom(validator).validate(fail),
            `expected '${fail}' to not be a valid ${fieldname}`
          ).to.have.property(`error`);
        });
      }
    });
  });
}

describe(`validations`, function () {
  describe(`field`, function () {
    validationFactory(
      `username`,
      [`abcdsaif`, `the_best_cookie`, `the_arda_candy`],
      [
        `thonk me`,
        `interest-name`,
        `0best0`,
        `adoifajvaejfiajdsfjiaesjfioaewjfojasilfjaeioswfj`,
      ],
      fields.username
    );
    validationFactory(
      `password`,
      [`akfjioefklsdfjio123`, `thebestp@ssw0rd`],
      [`correcthorsebatterystaple`, `toosh`, `12345678`, `!()*()#$)(#)@#)$`],
      fields.password
    );
    validationFactory(
      `mongoId`,
      [`61be52b80deb32d32263efbb`],
      [`thonk`, `1`, `!()*()#$)(#)@#)$`],
      fields.objectId
    );
    validationFactory(
      `emails`,
      [`themonk@gmail.com`, `nopeless@stem.help`, `b@b.b`],
      [`thonk`, `usuk@d@nk`, `!()*()#$)(#)@#)$`, `karon!stupk#.com`],
      fields.email
    );
  });
  describe(`discord`, function () {
    describe(`oauth`, function () {
      validationFactory(
        `token`,
        [`NhhvTDYsFcdgNLnnLijcl7Ku7bEEeee`],
        [`asdfaegadsfa`, `bonk.bonk`, `funk`],
        discord.oauth.token
      );
    });
  });
});
