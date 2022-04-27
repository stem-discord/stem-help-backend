import { generatePassword } from "../../src/util/crypto/index.js";

const password = `testp@ssw0rd`;

const { salt, hash } = generatePassword(password);

export default [
  {
    name: `john the great`,
    username: `johndoe`,
    salt,
    hash,
    roles: [`ADMINISTRATOR`],
  },
];
