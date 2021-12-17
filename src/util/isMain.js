import { fileURLToPath } from "url";
export default function (meta) {
  if (!meta?.url) throw new Error(`.url is required`);
  return process.argv[1] === fileURLToPath(meta.url);
}
