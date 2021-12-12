import { generate } from "../../src/service/generatePngFromHtml.js";

import fs from "fs";

describe(`generatePngFromHtml`, function() {
  it(`should generate png from html`, async function() {
    const text = `Hello`;

    const png = generate(text);

    expect(await png).to.be.an.instanceof(Buffer);
  });
});
