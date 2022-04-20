import c from "canvas";

import { streamToBuffer } from "../util/index.js";

const { createCanvas } = c;

async function generate(text) {
  const canvas = createCanvas(800, 200);
  const ctx = canvas.getContext(`2d`);
  ctx.font = `100px Impact`;
  ctx.fillText(text.toString(), 50, 100);
  return streamToBuffer(canvas.createPNGStream());
}

export { generate };
