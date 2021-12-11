import chai from "chai";
import spies from "chai-spies";

chai.use(spies);

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

  let t;

  if (reason) {
    t = it.test.title;
    if (t) {
      t += ` - reason: ${reason}`;
    } else {
      t = reason;
    }
  } else {
    t = `${it.test.title} - Unknown reason`;
  }

  function edit(it) {
    it.title = `[⚠️ SKIPPED] ${t}`;
  }

  // It is a suite
  if (it.currentTest) {
    for (const test of it.currentTest.parent.tests) {
      edit(test);
    }
  } else {
    edit(it.test);
  }

  it.skip(reason);
}

global.needs = needs;
