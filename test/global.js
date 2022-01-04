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

for (const type of [`before`, `beforeEach`, `after`, `afterEach`]) {
  let f = global[type];

  global[type] = function (...args) {
    const executor = args[args.length - 1];
    if (executor instanceof Function) {
      args[args.length - 1] = function (...args) {
        // Lexical scoping
        this._type = type;
        Reflect.apply(executor, this, args);
      };
    }
    return Reflect.apply(f, this, args);
  };
}

/**
 * return falsy value for no error. throw or return anything else for error
 */
Context.prototype.needs = function (...ops) {
  if (typeof this.skip !== `function`) {
    // Assume we are in a describe
    throw new Error(`No this context (is it in an 'it' scope?)`);
  }

  if (![`before`, `beforeEach`].includes(this._type)) {
    throw new Error(`needs() should be called in a 'before' or 'beforeEach'`);
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

  function edit(test) {
    test.title = `[⚠️ SKIPPED] ${test.title} - ${reason}`;
  }

  if (this._type === `before`) {
    // modify test racks one by one
    this.currentTest.parent.tests.forEach(test => edit(test));
  } else if (this._type === `beforeEach`) {
    // modify current test rack
    // console.log(this)
    edit(this.currentTest);
  }

  this.skip();
};
