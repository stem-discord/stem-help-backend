import fs from "fs";

import puppeteer from "puppeteer";

import { dirname, async } from "../util/index.js";

import config from "../config/index.js";
import { Logger } from "../tool/logger.js";

const logger = Logger(`generatePngFromHtml`);

const { Sequential } = async;

let browser;
let page;

let browserInit;

let isRunning = false;
let error: Error;

const init = () => {
  if (error) throw error;
  if (isRunning) return null;
  isRunning = true;
  const headless = config.env !== `development`;

  logger.info(`launching headless=${headless} chrome instance`);

  browserInit = puppeteer
    .launch({
      args: [`--no-sandbox`, `--disable-setuid-sandbox`],
      headless,
    })
    .then(async v => {
      browser = v;
      page = await browser.newPage();

      await page.setContent(
        await fs.promises.readFile(
          dirname(import.meta, `htmlBoilerPlate.html`),
          `utf8`
        )
      );
      await page.setJavaScriptEnabled(true);
    });
  return browserInit.catch((e: Error) => {
    logger.error(e);
    error = e;
  });
};

if (config.env === `production`) {
  init();
}

async function generateInner(
  text: string,
  options: {
    style?: string;
  } = {}
) {
  await init();

  const t = text;
  const style = options.style;

  await page.evaluate(
    async (t: string, style: string) => {
      /* eslint-disable no-undef */
      const body = document.getElementsByTagName(`body`)[0];
      body.innerHTML = t;
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      body.style = style;
      const selectors = Array.from(document.querySelectorAll(`img`));
      await Promise.all(
        selectors.map(img => {
          if (img.complete) return null;
          return new Promise(resolve => {
            img.onload = resolve;
            img.onerror = resolve;
          });
        })
      );
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

  return await page.screenshot({
    clip: { width: Math.max(width, 1), height: Math.max(height, 1), x, y },
  });
}

const generate = Sequential(generateInner);

export { generate };
