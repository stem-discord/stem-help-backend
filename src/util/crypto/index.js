import crypto from "crypto";

const ROUNDS = 10000;

/**
 *
 * @param {String} password - The plain text password
 * @param {String} hash - The hash base64 stored in the database
 * @param {} salt - The salt stored in the database
 *
 * This function uses the crypto library to decrypt the hash using the salt and then compares
 * the decrypted hash/salt with the password that the user provided at login
 */
function validatePassword(password, hash, salt) {
  var hashVerify = crypto.pbkdf2Sync(password, salt, ROUNDS, 64, `sha512`).toString(`hex`);
  return crypto.timingSafeEqual(hash, hashVerify);
}

/**
 *
 * @param {String} password - The password string that the user inputs to the password field in the register form
 *
 * This function takes a plain text password and creates a salt and hash out of it.  Instead of storing the plaintext
 * password in the database, the salt and hash are stored for security
 *
 * ALTERNATIVE: It would also be acceptable to just use a hashing algorithm to make a hash of the plain text password.
 * You would then store the hashed password in the database and then re-hash it to verify later (similar to what we do here)
 */
function generatePassword(password) {

  const salt = crypto.randomBytes(32).toString(`hex`);
  const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, `sha512`).toString(`hex`);

  return { salt, hash };
}

export { generatePassword, validatePassword };
