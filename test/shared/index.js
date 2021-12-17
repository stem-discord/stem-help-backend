// shared mock objects go here
// Before and after hooks should replace shared object

import Discord, { Collection } from "discord.js";

import shared from "../../src/shared/index.js";

const mocks = {
  discord: {
    stem: {
      guild: {
        id: `493173110799859713`,
        members: {
          // This is stupid
          resolve(m) {
            return { nickname: `Satan`, ...m };
          },
        },
      },
    },
    client: {
      users: {
        cache: new Collection([
          [
            `220327217312432129`,
            {
              id: `220327217312432129`,
              username: `nope`,
              discriminator: `6924`,
            },
          ],
        ]),
      },
    },
  },
  mongo: {},
};

const mock = args => {
  if (typeof beforeEach !== `function`) {
    throw new Error(`Mocha was not loaded`);
  }

  if (args === undefined) {
    args = Object.keys(mocks);
  } else {
    if (!Array.isArray(args)) args = [args];
  }

  const temp = Object.create(null);

  for (const name of args) {
    if (!shared[name]) {
      throw new Error(`Unknown shared object: ${name}`);
    }
    temp[name] = shared[name];
  }

  before(`Replacing shared with mock [${args.join(`,`)}]`, function () {
    for (const name of args) {
      shared[name] = mocks[name];
    }
  });

  after(`Reverting mock object in shared [${args.join(`,`)}]`, function () {
    for (const name of args) {
      shared[name] = temp[name];
    }
  });
};

function mockModule(name, module) {
  // replace individual modules
}

// Mock modules
export default mocks;

// Mock helper mocha hooks
export { mock };
