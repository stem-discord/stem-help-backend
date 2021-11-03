// temporary file

// class MetaPermissionTemplate {
//   constructor() {
//     if (!id) throw new Error(`id should not be falsy`);
//     this._id = id;
//   }

//   get id() { return this._id; }

//   /**
//    * Static method
//    */
//   load() {s
//     throw new Error(`not implemented`);
//   }
// }

class ViewHistory {
  constructor() {

  }
}

class RoleCollection {
  constructor(roles) {
    const roleObj = {};
    for (const role of roles) {
      if (roleObj[role.id] !== undefined) throw new Error(`duplicate role id: ${role.id}`);
      roleObj[role.id] = role;
    }
    this.roleObj = roleObj;
  }
}

class Role {
  constructor(name, permissions) {
    this.name = name;
    this.permissions = permissions;
  }

  can() {

  }
}

/**
 * constructor from primitives
 */
class User {
  constructor(roles) {
    this.roles = roles;
  }
}

const admin = new Role(`Administrator`);
const moderator = new Role(`Moderator`);

const users = {
  nop: {
    roles: [
      `Admin`,
    ],
  },
  rem: {
    roles: [
      `Moderator`,
    ],
  },
};

const nop = new User(users.nop.roles);
const rem = new User(users.rem.roles);
