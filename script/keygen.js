/**
 * This module will generate a public and private keypair and save to current directory
 *
 * Make sure to save the private key elsewhere after generated!
 */

// source: https://github.com/zachgoll/express-jwt-authentication-starter/blob/final/generateKeypair.js
import "./mkdirEnv.js";
import crypto from "crypto";
import fs from "fs";

import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const pubpath = path.join(__dirname, `../env/id_rsa_pub.pem`),
  privpath = path.join(__dirname, `../env/id_rsa_priv.pem`);

// check if files already exist since it would be terrible to overwrite them
if (fs.existsSync(pubpath) || fs.existsSync(privpath)) {
  throw new Error(`Files already exist, please remove them before generating new keys`);
}

function genKeyPair() {

  // Generates an object where the keys are stored in properties `privateKey` and `publicKey`
  const keyPair = crypto.generateKeyPairSync(`rsa`, {
    modulusLength: 4096, // bits - standard for RSA keys
    publicKeyEncoding: {
      type: `pkcs1`, // "Public Key Cryptography Standards 1"
      format: `pem`, // Most common formatting choice
    },
    privateKeyEncoding: {
      type: `pkcs1`, // "Public Key Cryptography Standards 1"
      format: `pem`, // Most common formatting choice
    },
  });

  // Create the public key file
  fs.writeFileSync(pubpath, keyPair.publicKey);

  // Create the private key file
  fs.writeFileSync(privpath, keyPair.privateKey);

  console.log(`generated keypair`);
}

// Generate the keypair
genKeyPair();
