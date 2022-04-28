import Joi from "joi";

const envVarsSchema = Joi.object()
  .keys({
    NO_CONFIG: Joi.string()
      .valid(`true`, `false`)
      .description(`Deletes all environment variables (ignores cli flags)`),
    NODE_ENV: Joi.string()
      .valid(`production`, `development`, `test`)
      .default(`development`)
      .description(`If test, test.env will be loaded`),
    APPLICATION_ENV: Joi.string().description(
      `The .env file to load. <APPLICATION_ENV>.env will be loaded.`
    ),
    PORT: Joi.number().default(3000).description(`The port for the API server`),
    SUPER_SECRET_ADMIN_KEY: Joi.string()
      .default(`admin`)
      .description(
        `The super secret admin key used to bypass anything for testing a feature in production`
      ),
    FRONTEND_URL: Joi.string()
      .description(`Url to render components and stuff`)
      .default(`https://beta.stem.help`),
    LOGGING_ABSOLUTE: Joi.string()
      .valid(`true`, `false`)
      .description(`Logging absolute time`),
    MONGODB_URL: Joi.string().description(`Mongo DB url`),
    STEM_INFORMATION_URL: Joi.string().description(
      `Mongo DB url for stem information (you won't have access to this unless ur an admin)`
    ),
    CONNECTIONS: Joi.string()
      .allow(``)
      .description(
        `Connections to open when the server starts. Leave it empty to enable all connections`
      ),
    JWT_PRIVATE_KEY: Joi.string().description(`JWT private key pem`),
    JWT_PUBLIC_KEY: Joi.string().description(`JWT public key pem`),
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
      `the from field in the emails sent by the app`
    ),
    CORS: Joi.string().valid(`true`, `false`).description(`Enable CORS`),
    API_URL: Joi.string().description(
      `url to make api calls to. used by src/static`
    ),
    DISCORD_BOT_TOKEN: Joi.string().description(`discord bot token`),
    DISCORD_UPLOAD_WEBHOOK: Joi.string().description(`discord upload webhook`),
    DISCORD_BOT_SERVER_GQL_URL: Joi.string()
      .description(`discord bot api server (graphql) url`)
      .default(`http://localhost:5003/graphql`),
    // temporary
    DISCORD_OAUTH_URI: Joi.string().description(`discord oauth uri`),
    DISCORD_CLIENT_ID: Joi.string().description(`discord app id`),
    DISCORD_CLIENT_SECRET: Joi.string().description(`discord app secret`),
    DISCORD_SERVER_STEM: Joi.string()
      .default(`493173110799859713`)
      .description(`main discord server id`),
    DISCORD_SERVER_GENERAL: Joi.string()
      .default(`839399426643591188`)
      .description(`general channel for the main discord server`),
    STATIC_SERVER: Joi.string()
      .valid(`true`, `false`)
      .description(`Enable static server`),
    STATIC_SERVER_PORT: Joi.number().description(
      `The port for another static server (if true, both api server and static server will be online)`
    ),
    STATIC_SERVER_API_URL: Joi.string().description(
      `The API url this static server should use`
    ),
    STATIC_ROUTE: Joi.string()
      .valid(`true`, `false`)
      .description(`Serve /static`),

    // Below are not exposed to config object, but only process.env
    ONLY_CLIENT: Joi.string()
      .valid(`true`, `false`)
      .description(`[TEST] Does not launch a server when testing client`),
  })
  .unknown();

export default envVarsSchema;
