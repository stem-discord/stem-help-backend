import s from "../src/config/envVarsSchema";

// TODO: make this better
function print(joiKey) {
  for (const v of Object.values(joiKey)) {
    const flags = v.flags;
    delete v.flags;
    for (const [k, vv] of Object.entries(flags)) {
      v[k] = vv;
    }
    if (v.allow) {
      v.options = `<${v.allow.join(`|`)}>`;
      delete v.allow;
    }
    if (!v.description) {
      v.description = `No description`;
    }
    if (v.presence) {
      v.default = `required`;
    }
  }
  // eslint-disable-next-line no-console
  console.table(joiKey, [`default`, `type`, `options`, `description`]);
}

print(s.describe().keys);
