/**
 * This module will generate a public and private keypair and save to current directory
 *
 * Make sure to save the private key elsewhere after generated!
 */

// source: https://github.com/zachgoll/express-jwt-authentication-starter/blob/final/generateKeypair.js

import crypto from "crypto";
import fs from "fs";

import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
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
  fs.writeFileSync(path.join(__dirname, `../env/id_rsa_pub.pem`), keyPair.publicKey);

  // Create the private key file
  fs.writeFileSync(path.join(__dirname, `../env/id_rsa_priv.pem`), keyPair.privateKey);

}

// Generate the keypair
genKeyPair();
