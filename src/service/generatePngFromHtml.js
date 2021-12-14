import path from "path";
import { fileURLToPath } from "url";

import puppeteer from "puppeteer";

import Sequential from "../util/async/Sequential.js";
import config from "../config/index.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

let browser;
let page;

let browserInit;

let isRunning = false;

const init = () => {
  if (isRunning) return null;
  isRunning = true;
  browserInit = puppeteer.launch({
    args: [`--no-sandbox`, `--disable-setuid-sandbox`],
  }).then(async v => {
    browser = v;
    page = await browser.newPage();

    await page.goto(`file:${path.join(__dirname, `htmlBoilerPlate.html`)}`);
    await page.setJavaScriptEnabled(false);
  });
  return browserInit;
};

if (config.env === `production`) {
  init();
}

async function generateInner(text) {
  await init();

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

  return await page.screenshot({ clip: { width, height, x, y }});
}

const generate = new Sequential(generateInner);

export { generate };
