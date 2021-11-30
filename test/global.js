import chai from "chai";

chai.config.truncateThreshold = 0;

global.chai = chai;
global.expect = chai.expect;
global.should = chai.should;
global.assert = chai.assert;

/**
 * return falsy value for no error. throw or return anything else for error
 */
function needs(it, ...ops) {
  if (typeof it.skip !== `function`) {
    // Assume we are in a describe
    throw new Error(`The test must have method skip (is it in an 'it' scope?)`);
  }

  let reason;

  for (const op of ops) {
    if (op === false) {
      reason = `Unknown reason`;
      break;
    }
    try {
      reason = op();
    } catch (e) {
      reason = e.message;
      break;
    }
  }

  if (reason) {
    let t = it.test.title;
    if (t) {
      t += ` - reason: ${reason}`;
    } else {
      t = reason;
    }
    it.test.title = `[⚠️ SKIPPED] ${t}`;
    it.skip(reason);
  }
}

global.needs = needs;
