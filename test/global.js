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

  for (let op of ops) {
    if (op instanceof Function) {
      try {
        op = op();
        if (op?.then) {
          throw new Error(`'needs' should be sync, recieved promise`, op);
        }
      } catch (e) {
        reason = e.message;
        break;
      }
    }
    if (op) {
      reason = `Unknown reason`;
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
    return;
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
