import { generate as genHtml } from "../../src/service/generatePngFromHtml.js";
import { generate as genBanner } from "../../src/service/generatePngBanner.js";

import fs from "fs";

describe(`generatePngFromHtml`, function() {
  before(`prime the browser`, async function () {
    this.timeout(10 * 1000);
    await genHtml(``);
  });
  it(`should generate png from html`, async function() {
    const text = `Hello`;

    const png = genHtml(text);

    expect(await png).to.be.an.instanceof(Buffer);
  });
  it(`should generate png using text (node canvas)`, async function() {
    const text = `Hello`;

    const png = genBanner(text);

    expect(await png).to.be.an.instanceof(Buffer);
  });
});
