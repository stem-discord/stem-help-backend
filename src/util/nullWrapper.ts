/**
 * Executes a function and returns null if it throws an exception.
 */
export default function <T>(func: (...args: never[]) => T): null | T {
  try {
    return func();
  } catch (e) {
    return null;
  }
}
