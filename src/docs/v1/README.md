# Auth

## Minor specs

An access token is valid for 10 minutes
A refresh token is valid for 2 months, entry is stored in database
A session is valid as long as active refresh token entry is in the database
And if a refresh token is detected to have less than a month of life left,
The server will respond with a new refresh token that the client can replace. 

### /auth/access

POST
```
Header: Bearer <refresh_token>
```
```js
// returns
{
  access_token,
  ?refresh_token,
}
```

returns an optional refresh token if the refresh token is over a month old.

> session = Session.findOne(refresh_token.session)
> if session expired: session.removeActive(); return { redirect: /login }
> access_token = session.user.createAccessToken()
> if session is over a month old: refresh_token = session.issueRefreshToken();
> return { access_token, refresh_token }

### /auth/login

POST
```js
// body
{
  username: "username",
  password: "password",
}

// returns
{
  access_token,
  refresh_token,
}
```

### /auth/refresh

<!-- POST
```js
// body
{
  refresh_token,
}

// returns
{
  refresh_token?,
  access_token,
}
```
> session = Session.findOne(req.refresh_token.session)
> session.issueRefreshToken() -> invalidates previous token (stored in Token), set active to new refresh token, return the new refresh token
> session.generateAccessToken() -> creates an access token with sub: user._id -->



# OAuth

/oauth/discord

POST
params: code

```js
// returns
{
  access_token,
  refresh_token,
}
```



# Schemas

```js
access_token = {
  sub: "userId",
  exp,
  iat,

  type: ACCESS,

  data: {}, // custom data
}

refresh_token = {
  sub: "userId",
  jti: "tokenId",
  iat,
  exp,

  session: "sessionId",
  type: REFRESH
}
```