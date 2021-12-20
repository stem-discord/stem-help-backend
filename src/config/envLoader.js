import fs from "fs";

import { dirname } from "../util/index.js";

function exp() {
  try {
    const pub = fs.readFileSync(
      dirname(import.meta, `../../env/id_rsa_pub.pem`),
      `utf8`
    );
    const priv = fs.readFileSync(
      dirname(import.meta, `../../env/id_rsa_priv.pem`),
      `utf8`
    );
    return {
      JWT_PRIVATE_KEY: priv,
      JWT_PUBLIC_KEY: pub,
    };
  } catch (e) {
    console.log(`Error loading keys:`, e);
  }
  return {};
}

export default exp;
