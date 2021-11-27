

/**
 * @param {...string}
 */
export function LCSFromStart(...args) {
  if (args.length === 0) {
    throw new Error(`This function requires at least one argument`);
  } else if (args.length === 1) {
    return args[0].length;
  }
  const min = Math.min(...args.map(v => v.length));
  let i = 0;
  for (; i < min; i++) {
    if (args.some(v => v[i] !== args[0][i])) {
      break;
    }
  }
  return i;
}
