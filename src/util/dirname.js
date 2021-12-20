import path, { dirname } from "path";
import { fileURLToPath } from "url";

/**
 * Accepts import.meta
 */
export default function (meta, ...paths) {
  if (typeof meta !== `string` && !meta.url) {
    throw new Error(`meta isn't a string nor meta.url is not defined`);
  }
  const __dirname = dirname(fileURLToPath(meta.url));

  if (paths.length) {
    return path.join(__dirname, ...paths);
  }
  return __dirname;
}
