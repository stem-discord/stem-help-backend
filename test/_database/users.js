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
  {
    name: `Xpiowolf`,
    username: `xpiowolf`,
    salt: `25d33dcf27d213c52e02b948b5e586c5c99c8f89abfae4f5ab21ec9cfff1ef97`,
    hash: `31b30955e2df8abb2a1b3ac13c1663a76f1bb0164dc60ea8840b3e26553cb0685c3656068a7085978f01c4cf9069191543e46e7edd68dc935028672bcee5e818`,
    roles: [`ADMINISTRATOR`],
  },
];
