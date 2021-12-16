import fetch from "node-fetch";

import env from "../config.js";

const url = env.API_URL;

async function register(username, password, options = {}) {
  if (!username || !password) throw new Error(`Missing username or password`);
  return fetch(`${url}/auth/register`, {
    method: `POST`,
    headers: {
      "Content-Type": `application/json`,
    },
    body: JSON.stringify({
      ...options,
      username,
      password,
    }),
  }).then(r => r.json());
}

async function login(username, password, options = {}) {
  if (!username || !password) throw new Error(`Missing username or password`);
  return fetch(`${url}/auth/login`, {
    method: `POST`,
    headers: {
      "Content-Type": `application/json`,
    },
    body: JSON.stringify({
      ...options,
      username,
      password,
    }),
  }).then(r => r.json());
}

async function refresh(refresh_token) {
  if (!refresh_token) throw new Error(`Missing refresh_token`);
  return fetch(`${url}/auth/refresh`, {
    method: `POST`,
    headers: {
      "Content-Type": `application/json`,
    },
    body: JSON.stringify({
      refresh_token,
    }),
  }).then(r => r.json());
}

export { register, login, refresh };
