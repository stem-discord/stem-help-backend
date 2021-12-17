const objectId = (value, helpers) => {
  if (!value.match(/^[0-9a-fA-F]{24}$/)) {
    return helpers.message(`"{{#label}}" must be a valid mongo id`);
  }
  return value;
};

const password = (value, helpers) => {
  if (value.length < 8) {
    return helpers.message(`password must be at least 8 characters`);
  }
  if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
    return helpers.message(
      `password must contain at least 1 letter and 1 number`
    );
  }
  return value;
};

const username = (value, helpers) => {
  if (!value.match(/^[a-z_][a-z0-9_]{0,31}$/)) {
    return helpers.message(`"{{#label}}" must be a valid username`);
  }
  return value;
};

const email = (value, helpers) => {
  if (
    !value.match(
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
    )
  ) {
    return helpers.message(`"{{#label}}" must be a valid email`);
  }
  return value;
};

export { objectId, password, username, email };
