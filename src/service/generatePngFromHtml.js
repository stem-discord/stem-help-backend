import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import puppeteer from "puppeteer";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const boilerplate = fs.readFileSync(path.join(__dirname, `./htmlBoilerPlate.html`)).toString();

async function generate(text) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(`data:text/html,${boilerplate.replace(`[[TEXT]]`, text)}`);

  const body = await page.$(`body`);

  let { width, height } = await body.boundingBox();

  width = Math.ceil(width);
  height = Math.ceil(height);

  await page.setViewport({ width, height });

  return page.screenshot({});
}

export { generate };
