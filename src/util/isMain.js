import { fileURLToPath } from "url";
export default function(meta) {
  return process.argv[1] === fileURLToPath(meta.url);
}
