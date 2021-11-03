// temporary file

class MetaRoleTemplate {
  /**
   * @param {string|function} name
   * @param {string|function} description
   * @param {function} builder
   */
  constructor(uuid, name, description, builder, args) {
    this._uuid = uuid;
    this.name = name;
    this._description = description instanceof String ? description : description(args);
    this.builder = builder;
  }

  get uuid() {
    return this._uuid;
  }

  get description() {
    return this._description;
  }
}

class ViewHistory extends MetaRoleTemplate {
  constructor(time) {
    super(`CAN_VIEW_HISTORY`, `history`, (time) => `view history up to ${time} days`, (time) => {}, [time]);
    this.time = time;
  }
}

class RoleManager {
  constructor() {
    this.roleObj = {};
  }

  add(role) {
    if (this.roleObj[role.uuid]) {
      throw new Error(`Role ${role.uuid} "${role.name}" already exists`);
    }
    this.roleObj[role.uuid] = role;
  }

  list() {
    return Object.values(this.roleObj);
  }
}

class User {
  constructor(username) {
    this.username = username;
    this.roleManager = new RoleManager();
  }

  addRole(role) {
    this.roleManager.add(role);
  }

  returnDescription() {
    return `User ${this.username} can` + (this.roles.map(v => `\n - ${v.description}`).join(``) || `'t do anything`);
  }

  get roles() {
    return this.roleManager.list();
  }
}


const nop = new User(`nope`);

nop.addRole(new ViewHistory(3));
// nop.addRole(new ViewHistory());

console.log(nop.returnDescription());

