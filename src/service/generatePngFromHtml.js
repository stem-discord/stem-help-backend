import path from "path";
import { fileURLToPath } from "url";

import puppeteer from "puppeteer";

import Sequential from "../util/async/Sequential.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const init = puppeteer.launch({
  args: [`--no-sandbox`, `--disable-setuid-sandbox`],
});

let browser;
let page;

init.then(async v => {
  browser = v;
  page = await browser.newPage();

  await page.goto(`file:${path.join(__dirname, `htmlBoilerPlate.html`)}`);
  page.setJavaScriptEnabled(false);
});

async function generateInner(text) {
  await init;


  const t = text;

  await page.evaluate((t) => {
    // eslint-disable-next-line no-undef
    document.getElementById(`text`).innerHTML = t;
  }, t);


  const body = await page.$(`body`);

  let { x, y, width, height } = await body.boundingBox();

  x = Math.ceil(x);
  y = Math.ceil(y);
  width = Math.ceil(width);
  height = Math.ceil(height);

  return page.screenshot({ clip: { width, height, x, y }});
}

const generate = new Sequential(generateInner);

export { generate };
