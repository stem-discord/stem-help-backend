import type { CustomValidator } from "joi";

const token: CustomValidator = (value, helpers) => {
  // TODO: I'm not sure if this is the correct regex, but its from observation
  if (!value.match(/^[\da-zA-Z_-]{20,}$/)) {
    return helpers.message({ format: `"{{#label}}" must be a valid token` });
  }
  return value;
};

export { token };
