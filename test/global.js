import chai from "chai";
import spies from "chai-spies";
import chaiAsPromised from "chai-as-promised";
import { Context } from "mocha";

import { Connection, NullConnection } from "../src/connection/connection.js";

import env from "./config.js";
import chaiString from "chai-string";

chai.use(spies);
chai.use(chaiString);
chai.use(chaiAsPromised);

chai.config.truncateThreshold = 0;

global.chai = chai;
global.expect = chai.expect;
global.should = chai.should;
global.assert = chai.assert;

/**
 * return falsy value for no error. throw or return anything else for error
 */
Context.prototype.needs = function (...ops) {
  if (typeof this.skip !== `function`) {
    // Assume we are in a describe
    throw new Error(`No this context (is it in an 'it' scope?)`);
  }

  let reason = null;

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
    } else {
      // Assume it is a connection
      if (op?.connection instanceof Connection) {
        if (!env.local) continue;
        if (op.connection.isOperational()) {
          continue;
        } else {
          reason = `${op.connection.name} is not operational`;
          break;
        }
      } else if (op?.connection instanceof NullConnection) {
        if (!env.local) continue;
        reason = `${op.connection.name} - ${op.connection.rejectReason}`;
        break;
      } else {
        throw new Error(`recieved argument that I can't understand`, op);
      }
    }

    if (op) {
      reason = op.toString();
      break;
    }
  }

  if (reason === null) return;

  function edit(test) {
    test.title = `[⚠️ SKIPPED] ${test.title} - ${reason}`;
  }

  const t = this.test.originalTitle.match(/(?<=")[\w ]+?(?=")/)[0];

  if (t === `before all`) {
    // modify test racks one by one
    this.currentTest.parent.tests.forEach(edit);
  } else if (t === `before each`) {
    // modify current test rack
    // console.log(this)
    edit(this.currentTest);
  }

  this.skip();
};
