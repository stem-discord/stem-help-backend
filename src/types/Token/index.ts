import Lock from "../Lock.js";

export default Lock({
  ACCESS: `ACCESS`,
  REFRESH: `REFRESH`,
  RESET_PASSWORD: `RESET_PASSWORD`,
  VERIFY_EMAIL: `VERIFY_EMAIL`,
} as const);
