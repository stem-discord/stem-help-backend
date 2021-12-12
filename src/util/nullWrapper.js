/**
 * Executes a function and returns null if it throws an exception.
 */
export default function (func) {
  try {
    return func();
  } catch(e) {
    return null;
  }
}
