import { EventEmitter } from "events";
// import { http, NotImplementedError } from '../util';
import { Logger } from "../tool";
import { ConnectionState, ConnectionEvent } from "../types";

/**
 * use ConnectionEvent to emit events
 */
class Connection extends EventEmitter {
  constructor({
    init,
    heartbeat,
    name,
    description,
    close,
  }) {
    super();
    if (!init) throw new Error(`init is required`);
    if (!heartbeat) throw new Error(`heartbeat is required`);
    if (!name) throw new Error(`name is required`);
    if (!close) throw new Error(`close is required`);
    this.name = name;
    this.description = description;
    this._state = ConnectionState.UNINITIALIZED;
    this._init = init;
    this.initialized = false;
    this.close = close;
    this.null = false;

    for (const [event, state] of [
      [ConnectionEvent.connected, ConnectionState.CONNECTED],
      [ConnectionEvent.disconnected, ConnectionState.DISCONNECTED],
      [ConnectionEvent.connecting, ConnectionState.CONNECTING],
      [ConnectionEvent.disconnecting, ConnectionState.DISCONNECTING],
    ]) {
      this.on(event, () => {
        this.state = state;
      });
    }

  }

  async close() {
    return await this.close();
  }
  /**
   * Helper function
   *
   * @param {String} eventMap { String: ConnectionEvent | Function => ConnectionEvent }
   */
  mapEvents(eventEmitter, eventMap){
    eventMap.entries().forEach(([source, target]) => {
      let handler;
      if (target instanceof Function) {
        handler = arg => this.emit(target(arg));
      } else {
        if (!Object.values(ConnectionEvent).includes(target)) {
          throw new Error(`event mapping ${target} is not a valid ConnectionEvent. valid values are ${Object.values(ConnectionEvent)}`);
        }
        handler = () => this.emit(target);
      }
      eventEmitter.on(source, handler);
    });
  }

  /**
   * @returns a `Promise` that waits initalization. Does not check whether it is operational.
   *
   * if not initialized, reject
   *
   * Essentially the same as `new Promise(r => this.on("connected", r))`
   */
  async init() {
    if (this.initialized) {
      return Promise.resolve();
    }
    return (async () => this._init())()
      .then(() => {
        this.state = ConnectionState.CONNECTED;
      }).finally(() => {
        this.initialized = true;
      });
  }

  /**
   * Similar to heartbeat
   *
   * @return {Boolean}
   */
  async heartbeat() {
    return this.heartbeat();
  }

  get state() {
    return this._state;
  }

  set state(val) {
    this._state = val;
  }

  isOperational() {
    return this.state === ConnectionState.CONNECTED;
  }
}


class NullConnection extends Connection {
  constructor({
    name,
    description,
  }, rejectReason) {
    if (!rejectReason) throw new Error(`rejectReason is required`);
    super({
      name,
      description,
      init: () => {},
      heartbeat: () => {},
      close: () => {},
    });
    this.null = true;
    this.rejectReason = rejectReason;
  }

  init() {
    return Promise.reject(new Error(`${this.name} is not initialized`));
  }
  heartbeat() {
    return Promise.reject(new Error(`${this.name} cannot send heartbeat to uninitialized interface`));
  }

  get state() {
    return ConnectionState.UNINITIALIZED;
  }

  set state(_) {
    throw new Error(`cannot set state of ${this.name} because it is uninitialized`);
  }
}

const loggerSymbol = Symbol(`logger`);

class Namespace {
  constructor(name, description) {
    this.name = name;
    this.description = description;
    this[loggerSymbol] = Logger(name);
  }

  get logger() {
    return this[loggerSymbol];
  }
}

export { Connection, NullConnection, Namespace };
