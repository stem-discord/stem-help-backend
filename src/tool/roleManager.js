import { Role } from "../types";

/**
 * Loads user from database roles
 */
class User {
  constructor(roles) {
    this.roles = roles;
  }

  can(role) {
    if (Role[role] === undefined) {
      throw new Error(`Role ${role} does not exist`);
    }
    return this.roles.includes(role);
  }
}

// TODO: move this entire section to the model of userSchema including the calculating logic for primitives

export { User };
