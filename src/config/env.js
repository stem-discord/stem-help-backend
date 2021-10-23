const Joi = require(`joi`);

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string()
      .valid(`production`, `development`, `test`)
      .required(),
    PORT: Joi.number().default(3000).description(`The port for the API server`),
    MONGODB_URL: Joi.string().required().description(`Mongo DB url`),
    JWT_SECRET: Joi.string().required().description(`JWT secret key`),
    JWT_ACCESS_EXPIRATION_MINUTES: Joi.number()
      .default(30)
      .description(`minutes after which access tokens expire`),
    JWT_REFRESH_EXPIRATION_DAYS: Joi.number()
      .default(30)
      .description(`days after which refresh tokens expire`),
    JWT_RESET_PASSWORD_EXPIRATION_MINUTES: Joi.number()
      .default(10)
      .description(`minutes after which reset password token expires`),
    JWT_VERIFY_EMAIL_EXPIRATION_MINUTES: Joi.number()
      .default(10)
      .description(`minutes after which verify email token expires`),
    SMTP_HOST: Joi.string().description(`server that will send the emails`),
    SMTP_PORT: Joi.number().description(`port to connect to the email server`),
    SMTP_USERNAME: Joi.string().description(`username for email server`),
    SMTP_PASSWORD: Joi.string().description(`password for email server`),
    EMAIL_FROM: Joi.string().description(
      `the from field in the emails sent by the app`,
    ),
    CORS: Joi.boolean().default(true).description(`Enable CORS`),
    API_URL: Joi.string().description(`url to make api calls to. used by src/static`),
    DISCORD_BOT_TOKEN: Joi.string().required().description(`discord bot token`),
    // temporary
    DISCORD_OAUTH_URI: Joi.string().required().description(`discord bot token`),
    STATIC_SERVER: Joi.string().valid(`true`, `false`).description(`discord bot token`),
    STATIC_SERVER_PORT: Joi.number().description(`The port for another static server (if true, both api server and static server will be online)`),
    STATIC_SERVER_API_URL: Joi.string().description(`The API url this static server should use`),
    STATIC_ROUTE: Joi.string().valid(`true`, `false`).description(`discord bot token`),
  })
  .unknown();

function generateConfig(env) {

  const { value: envVars, error } = envVarsSchema
    .prefs({ errors: { label: `key` } })
    .validate(env);
  
  if (error) {
    throw new Error(`Config validation error: ${error.message}`);
  }
  
  // TODO: deepMerge
  return {
    env: envVars.NODE_ENV,
    port: envVars.PORT,
    apiURL: envVars.API_URL,
    mongoose: {
      url: envVars.MONGODB_URL + (envVars.NODE_ENV === `test` ? `-test` : ``),
      options: {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
    },
    jwt: {
      secret: envVars.JWT_SECRET,
      accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
      refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
      resetPasswordExpirationMinutes:
        envVars.JWT_RESET_PASSWORD_EXPIRATION_MINUTES,
      verifyEmailExpirationMinutes: envVars.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES,
    },
    email: {
      smtp: {
        host: envVars.SMTP_HOST,
        port: envVars.SMTP_PORT,
        auth: {
          user: envVars.SMTP_USERNAME,
          pass: envVars.SMTP_PASSWORD,
        },
      },
      from: envVars.EMAIL_FROM,
    },
    cors: envVars.CORS,
    discord: {
      TOKEN: envVars.DISCORD_BOT_TOKEN,
    },
    staticServer: envVars.STATIC_SERVER,
    staticServerPort: envVars.STATIC_SERVER_PORT,
    staticServerApiURL: envVars.STATIC_SERVER_API_URL,
    staticRoute: envVars.STATIC_ROUTE,
  };
}

module.exports = generateConfig;
