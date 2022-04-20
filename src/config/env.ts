import envVarsSchema from "./envVarsSchema.js";

function bool(s: string) {
  return s === `true`;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Env = { [key: string]: any | string | number | boolean | undefined | Env };

export type { Env };

function generateConfig(env: Env): Env {
  const { value: envVars, error } = envVarsSchema
    .prefs({ errors: { label: `key` } })
    .validate(env);

  if (error) {
    throw new Error(`Config validation error: ${error.message}`);
  }

  return {
    env: envVars.NODE_ENV,
    port: envVars.PORT,
    apiURL: envVars.API_URL,
    adminKey: envVars.SUPER_SECRET_ADMIN_KEY,
    connections: envVars.CONNECTIONS?.match(/^\s+$/)
      ? []
      : envVars.CONNECTIONS?.split(/\s*,\s*/g),
    logging: {
      absolute: bool(envVars.LOGGING_ABSOLUTE),
    },
    mongoose: {
      url: envVars.MONGODB_URL,
      options: {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        bufferMaxEntries: 0,
        bufferCommands: false,
        connectTimeoutMS: 5000,
        socketTimeoutMS: 5000,
      },
    },
    stemInformation: {
      url: envVars.STEM_INFORMATION_URL,
      options: {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        bufferMaxEntries: 0,
        bufferCommands: false,
        connectTimeoutMS: 5000,
        socketTimeoutMS: 5000,
      },
    },
    jwt: {
      publicKey: envVars.JWT_PUBLIC_KEY,
      privateKey: envVars.JWT_PRIVATE_KEY,
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
      apiServer: {
        port: envVars.DISCORD_BOT_SERVER_PORT,
      },
      botToken: envVars.DISCORD_BOT_TOKEN,
      OAuthUri: envVars.DISCORD_OAUTH_URI,
      clientID: envVars.DISCORD_CLIENT_ID,
      clientSecret: envVars.DISCORD_CLIENT_SECRET,
      uploadWebhook: envVars.DISCORD_UPLOAD_WEBHOOK,
      server: {
        stem: envVars.DISCORD_SERVER_STEM,
        general: envVars.DISCORD_SERVER_GENERAL,
      },
    },
    staticServer: bool(envVars.STATIC_SERVER),
    staticServerPort: envVars.STATIC_SERVER_PORT,
    staticServerApiURL: envVars.STATIC_SERVER_API_URL,
    staticRoute: bool(envVars.STATIC_ROUTE),
  };
}

export default generateConfig;
