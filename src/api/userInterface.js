
function NI() {
  return new Error(`Not implemented`);
}

class UserInterface {
  constructor(module) {
    // used to access field in database query
    this.module = module;
  }

  // you should not override this method
  info(user) {
    const u = user[this.module];
    if (!u) throw new Error(`User does not have module info '${this.module}'`);
    return u;
  }

  send(user, obj) {
    // send arbitrary data to user
    user; obj;
    throw NI();
  }

  awaitUserInput(user, timeout) {
    // await single arbitrary response from user
    // timeout is in ms
    user; timeout;
    throw NI();
  }
}

module.exports = UserInterface;