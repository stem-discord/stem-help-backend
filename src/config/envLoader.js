import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

function exp() {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));

  const envDir = path.join(__dirname, `../../env`);

  try {
    const pub = fs.readFileSync(path.join(envDir, `id_rsa_pub.pem`), `utf8`);
    const priv = fs.readFileSync(path.join(envDir, `id_rsa_priv.pem`), `utf8`);
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
