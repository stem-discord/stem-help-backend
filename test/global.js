import chai from "chai";
import spies from "chai-spies";
import { Context } from "mocha";

chai.use(spies);

chai.config.truncateThreshold = 0;

global.chai = chai;
global.expect = chai.expect;
global.should = chai.should;
global.assert = chai.assert;

/**
 * return falsy value for no error. throw or return anything else for error
 */
function needs(...ops) {
  if (typeof this.skip !== `function`) {
    // Assume we are in a describe
    throw new Error(`No this context (is it in an 'it' scope?)`);
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
      reason = op.toString();
      break;
    }
  }

  let t;

  if (reason) {
    t = this.test.title;
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
  if (this.currentTest) {
    for (const test of this.currentTest.parent.tests) {
      edit(test);
    }
  } else {
    edit(this.test);
  }

  this.skip(reason);
}

Context.prototype.needs = needs;
