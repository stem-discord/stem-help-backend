import puppeteer from "puppeteer";

import { dirname, async } from "../util/index.js";

import config from "../config/index.js";

const { Sequential } = async;

let browser;
let page;

let browserInit;

let isRunning = false;

const init = () => {
  if (isRunning) return null;
  isRunning = true;
  browserInit = puppeteer
    .launch({
      args: [`--no-sandbox`, `--disable-setuid-sandbox`],
      headless: config.env !== `development`,
    })
    .then(async v => {
      browser = v;
      page = await browser.newPage();

      await page.goto(`file:${dirname(import.meta, `htmlBoilerPlate.html`)}`);
      await page.setJavaScriptEnabled(false);
    });
  return browserInit;
};

if (config.env === `production`) {
  init();
}

async function generateInner(text, options = {}) {
  await init();

  const t = text;
  const style = options.style;

  await page.evaluate(
    (t, style) => {
      /* eslint-disable no-undef */
      const body = document.getElementsByTagName(`body`)[0];
      body.innerHTML = t;
      body.style = style;
      /* eslint-enable no-undef */
    },
    t,
    style
  );

  const body = await page.$(`body`);

  let { x, y, width, height } = await body.boundingBox();

  x = Math.ceil(x);
  y = Math.ceil(y);
  width = Math.ceil(width);
  height = Math.ceil(height);

  return await page.screenshot({ clip: { width, height, x, y } });
}

const generate = new Sequential(generateInner);

export { generate };
