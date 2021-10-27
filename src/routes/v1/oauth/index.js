const httpStatus = require(`http-status`);
const fetch = require(`node-fetch`);

const lib = require(`../../lib`);
const config = lib.config;
const { Validate, redirect, ServePage } = lib.middlewares;
const { discord } = lib.validations;
const { pages } = lib;
const { userService } = lib.services;

const router = lib.Router();

router.get(`/discord`,
  (req, res) => {
    if (config.discord.OAuthUri) {
      return res.status(httpStatus.OK).json({
        status: `OK`,
        message: config.discord.OAuthUri,
      });
    }
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: `ERROR`,
      message: `redirect link was not set`,
    });
  },
);

router.post(`/discord`,
  async (req, res) => {
    if (!req.query.code) {
      return res.status(httpStatus.BAD_REQUEST).json({
        status: `ERROR`,
        message: `missing code`,
      });
    }
    const here = req.query.here;
    if (!here) {
      return res.status(httpStatus.BAD_REQUEST).json({
        status: `ERROR`,
        message: `missing source url`,
      });
    }
    // TODO: softcode this
    // if (!config.allowedSources.includes(source)) { unauthorized origin }
    const source = req.headers.origin;
    const allowedSources = [`http://localhost:4000`];
    console.log(source);
    if (!allowedSources.includes(source)) {
      return res.status(httpStatus.UNAUTHORIZED).send(`unauthroized`);
    }
    const payload = {
      client_id: config.discord.clientID,
      client_secret: config.discord.clientSecret,
      grant_type: `authorization_code`,
      code: req.query.code,

      redirect_uri: here,
    };
    
    const headers = {
      "Content-Type": `application/x-www-form-urlencoded`,
    };

    const response = await fetch(`https://discord.com/api/oauth2/token`, {
      method: `POST`,
      body: new URLSearchParams(payload),
      headers,
    }).then(v => v.json());
    
    // FIXME: remove this
    console.log(response);
    if (response.error) {
      res.json({ error: `error in request`});
      return;
    } 
    if (!response.access_token) {
      res.json({ error: `no access_token`});
      return;
    }
    // TODO: add scope checks
    
    const accessToken = res.access_token;

    const discordUser = await fetch(`https://discord.com/api/users/@me`, {
      headers: {
        authorization: `${response.token_type} ${response.access_token}`,
      },
    }).then(v => v.json());

    const discordId = discordUser.id;
    const user = await userService.discord.getUserById(discordId);

    if (!user) {
      // user does not exist. create user
      return res.json({ error: `user does not exist`});
      // userService.createUser({
      //   name: discordUser.tag,
      //   user_id: {}
      // })
    }
    // create a session

    // finally return the token

    // res.json({
    //   token:
    //   refresh_token:
    // })
  },
);

module.exports = router;
