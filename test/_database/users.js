import { generatePassword } from "../../src/util/crypto/index.js";

const password = `password1`;

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
