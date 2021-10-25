const envVarsSchema = require(`./envVarsSchema`);

function bool(s) {
  return s === `true`;
}

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
        bufferMaxEntries : 0,
        bufferCommands: false,
        connectTimeoutMS: 5000,
        socketTimeoutMS: 5000,
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
    cors: bool(envVars.CORS),
    discord: {
      botToken: envVars.DISCORD_BOT_TOKEN,
      OAuthUri: envVars.DISCORD_OAUTH_URI,
    },
    staticServer: bool(envVars.STATIC_SERVER),
    staticServerPort: envVars.STATIC_SERVER_PORT,
    staticServerApiURL: envVars.STATIC_SERVER_API_URL,
    staticRoute: bool(envVars.STATIC_ROUTE),
  };
}

module.exports = generateConfig;
