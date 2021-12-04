/**
 * Executes a function and returns null if it does not exist
 */
export default function (func) {
  try {
    return func();
  } catch(e) {
    return null;
  }
}
