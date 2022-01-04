import discordScope from "./discord.com/index.js";

const scopes = {
  "discord.com": discordScope,
};

function setEnabled(scopes, enabled) {
  scopes.forEach(scope => {
    scope.interceptors.forEach(i => {
      i.enabled = enabled;
    });
  });
}

if (typeof before !== `undefined`) {
  setEnabled(Object.values(scopes), false);
}

// Fast check
for (const [key, module] of Object.entries(scopes)) {
  if (Array.isArray(module.interceptors)) {
    module.key = key;
    continue;
  }
  throw new Error(`module must be a nock.Scope`);
}

/**
 * Enables http intercept for the test case
 */
function nockFunction(args) {
  if (!Array.isArray(args)) {
    args = [args];
  }

  for (const v of args) {
    if (typeof v !== `string`) {
      throw new Error(
        `nockFunction expects an array of strings, recieved`,
        args
      );
    }
  }

  const si = Object.create(null);

  sl: for (const arg of args) {
    for (const [dom, scope] of Object.entries(scopes)) {
      if (si[dom]) continue;
      if (arg.toLowerCase().includes(dom.toLowerCase())) {
        si[dom] = scope;
        continue sl;
      }
    }
  }

  // only enable those that were not persisted
  const nockingScopes = Object.values(si);
  const nockingScopeNames = Object.keys(si).join(`, `);

  before(`Nocking [${nockingScopeNames}]`, function () {
    setEnabled(nockingScopes, true);
  });

  after(`Remove nocks [${nockingScopeNames}]`, function () {
    setEnabled(nockingScopes, false);
  });
}

export { nockFunction as nock };
