import { generate as genHtml} from "../../src/service/generatePngFromHtml.js";
import { generate as genBanner} from "../../src/service/generatePngBanner.js";

import fs from "fs";

describe(`generatePngFromHtml`, function() {
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
