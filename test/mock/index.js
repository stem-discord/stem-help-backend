
import nock from 'nock';
import discordInterceptor from "./discord.com";

const interceptors = {
  "discord.com": discordInterceptor,
};

// Fast check
for (const module of Object.values(interceptors)) {
  // TODO add some type checking here
  // if (typeof module !== ``) {
  //   throw new Error(`Expected scope, got ${typeof module}`);
  // }
}

/**
 * Enables http intercept for the test case
 */
function nockFunction(args) {
  // eslint-disable-next-line no-console
  return console.warn(`Until nock accepts my pr, this feature is disabled`);
  // eslint-disable-next-line no-unreachable
  if (typeof beforeEach !== `function`) {
    throw new Error(`Mocha was not loaded`);
  }

  if (args === undefined) {
    args = Object.keys(interceptors);
  } else {
    if (!Array.isArray(args)) args = [args];
  }

  for (const name of args) {
    if (!interceptors[name]) {
      throw new Error(`Unknown interceptor: ${name}`);
    }
  }

  // only enable those that were not persisted
  args = args.filter(v => v._persist === false);

  before(`Nocking [${args.join(`,`)}]`, function () {
    for (const name of args) {
      interceptors[name].persist(true);
    }
  });

  after(`Remove nocks [${args.join(`,`)}]`, function () {
    for (const name of args) {
      nock.removeInterceptor(interceptors[name]);
    }
  });
}

export { nockFunction as nock };
