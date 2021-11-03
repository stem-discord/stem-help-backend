
if (process.argv.length < 3) {
  throw new Error(`Provide a password to hash/salt`);
} else if (process.argv.length >= 4) {
  throw new Error(`Too many arguments`);
}

import { generatePassword } from "../src/util/crypto/index.js";

const { salt, hash } = generatePassword(process.argv[2]);

console.log(`salt: ` + salt);
console.log(`hash: ` + hash);
