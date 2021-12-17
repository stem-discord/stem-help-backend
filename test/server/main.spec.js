import fetch from "node-fetch";
import { nock } from "../mock/index.js";

describe(`discord api`, function () {
  it(`should return 404 (mock)`, async function () {
    nock(`discord.com`);
    const res = await fetch(`https://discord.com/api/v9/`).then(v => v.json());
    expect(res).to.have.property(`message`);
    expect(res).to.have.property(`custom`);
  });

  it(`should return 404 (real)`, async function () {
    this.skip();
    const res = await fetch(`https://discord.com/api/v9/`).then(v => v.json());
    expect(res).to.have.property(`message`);
    expect(res).to.not.have.property(`custom`);
  });
});

describe(`JWT Authflow`, function () {
  it(`Should insert a token in the database`);
});
