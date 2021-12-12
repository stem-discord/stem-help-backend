import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import puppeteer from "puppeteer";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const boilerplate = fs.readFileSync(path.join(__dirname, `./htmlBoilerPlate.html`)).toString();

async function generate(text) {
  const browser = await puppeteer.launch({
    args: [`--no-sandbox`, `--disable-setuid-sandbox`],
  });
  const page = await browser.newPage();

  await page.goto(`data:text/html,${boilerplate.replace(`[[TEXT]]`, text)}`);

  page.setJavaScriptEnabled(false);

  const body = await page.$(`body`);

  let { x, y, width, height } = await body.boundingBox();

  x = Math.ceil(x);
  y = Math.ceil(y);
  width = Math.ceil(width);
  height = Math.ceil(height);

  return page.screenshot({ clip: { width, height, x, y }});
}

export { generate };
