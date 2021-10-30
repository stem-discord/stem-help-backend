import jwt from "jsonwebtoken";
import { mongo } from "../shared";
import config from "../config";
import { Token as TokenType } from "../types";

class Token {
  constructor(type, payload, expire) {
    if (!type || !payload || !expire) throw new Error(`Insufficient parameters`);
    this.type = type;
    payload = {
      ...payload,
      type,
    };
    this.payload = payload;
    // this.payload = payload;
    this.signedToken = jwt.sign(payload, config.jwt.privatekey, {
      expiresIn: expire,
    });
  }

  toString() {
    return this.getJWT();
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
    };
    // TODO: softcode this
    super(TokenType.ACCESS, payload, `10m`);
  }
}

class RefreshToken extends Token {
  constructor(user, sessionId, jti) {
    if (!sessionId || !jti) throw new Error(`Insufficient parameters`);
    const payload = {
      sub: user._id,
      jti,
      session: sessionId,
    };
    // TODO: softcode this
    super(TokenType.REFRESH, payload, `60days`);
  }
}

/**
 * Optionally return a refresh token as well
 */
async function generateAccessToken(user, refreshToken) {
  // TODO: review security
  // redundant security checks
  if (user._id !== refreshToken.sub) throw new Error(`subject is not identical to token subject`);
  if (user.session !== refreshToken.session) throw new Error(`session is not the valid session`);

  const accessToken = new AccessToken(user);
  let newRefreshToken;

  // FIXME: add duration checks
  // eslint-disable-next-line
  if (true) {
    mongo.Token.deleteOne({ _id: refreshToken._id });
    const rt = await mongo.Token.create();
    refreshToken = new RefreshToken(user, user.session, rt._id).toString();
  }

  return {
    access_token: accessToken,
    refresh_token: newRefreshToken,
  };
}

/**
 * returns a pair, creates a new session in the database
 */
async function createSession(user, sessionName) {
  sessionName = sessionName ?? `default session`;
  const session = await mongo.Session.create({
    name: sessionName,
  });
  const rt = await mongo.Token.create();
  const refreshToken = new RefreshToken(user, session._id, rt._id).toString();
  const accessToken = new AccessToken(user).toString();
  return {
    refresh_token: refreshToken,
    access_token: accessToken,
  };
}

async function deleteSession(sessionId) {
  return await mongo.Session.deleteOne({ _id: sessionId });
}

async function deleteCurrentSession(user) {
  return await Promise.all(deleteSession(user.session), mongo.Token.deleteOne({ _id: user.jti }));
}

export { createSession, generateAccessToken, deleteSession, deleteCurrentSession };
