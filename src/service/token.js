import jwt from "jsonwebtoken";
import config from "../config/index.js";
import { Token as TokenType } from "../types/index.js";

import { logger } from "../tool/index.js";

import shared from "../shared/index.js";
class Token {
  constructor(type, payload, expire) {
    if (!type || !payload || !expire)
      throw new Error(`Insufficient parameters`);
    this.type = type;
    payload = {
      ...payload,
      type,
    };
    this.payload = payload;
    // this.payload = payload;
    this.signedToken = jwt.sign(payload, config.jwt.privateKey, {
      expiresIn: expire,
    });
  }

  toString() {
    return this.signedToken;
  }

  parse(token) {
    throw new Error(`Not implemented`);
  }

  // Implement this later if needed
  from() {
    throw new Error(`Not implemented`);
  }
}

class AccessToken extends Token {
  constructor(user) {
    const payload = {
      sub: user._id,
      user: user.toAccessToken(),
    };
    // TODO: softcode this
    super(TokenType.ACCESS, payload, `10m`);
  }
}

class RefreshToken extends Token {
  constructor(user, jti) {
    if (!jti) throw new Error(`Insufficient parameters`);
    const payload = {
      sub: user._id,
      jti,
    };
    // TODO: softcode this
    super(TokenType.REFRESH, payload, `60days`);
  }
}

function createAccessToken(user) {
  return new AccessToken(user).toString();
}

async function createRefreshToken(user) {
  const token = await shared.mongo.Token.create({
    user: user._id,
  });
  return new RefreshToken(user, token._id).toString();
}

export { createAccessToken, createRefreshToken };
