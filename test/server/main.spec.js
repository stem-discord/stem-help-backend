import fetch from "node-fetch";
import { nock } from "../mock/index.js";

describe(`discord api`, function () {
  it(`should return 404 (real)`, async function () {
    const res = await fetch(`https://discord.com/api/v9/`).then(v => v.json());
    expect(res).to.have.property(`message`);
    expect(res).to.not.have.property(`custom`);
  });

  describe(`nock`, function () {
    nock(`discord.com`);
    it(`should return 404 (mock)`, async function () {
      const res = await fetch(`https://discord.com/api/v9/`).then(v =>
        v.json()
      );
      expect(res).to.have.property(`message`);
      expect(res).to.have.property(`custom`);
    });
  });
});

describe(`JWT Authflow`, function () {
  it(`Should insert a token in the database`);
});
