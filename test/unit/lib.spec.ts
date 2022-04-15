import _ from "lodash";

describe(`lodash`, function () {
  it(`these should all work`, function () {
    const object = {
      a: [{ b: 2 }, { d: 4 }],
    };

    const other = {
      a: [{ c: 3 }, { e: 5 }],
    };
    expect(_.merge(object, other)).to.deep.equal({
      a: [
        { b: 2, c: 3 },
        { d: 4, e: 5 },
      ],
    });
  });
});
