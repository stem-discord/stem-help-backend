// Stupid npm developers don't even know how to write
// a copy file script without it having to have millions o f stupid
// pieces of garbage in their code like bruh its copying frikin file how complicated can it frikin be
// you don't even know how to write a copy file script without it having to have millions of stupid

import fs from "fs";
import path from "path";

const cwd = process.cwd();

console.log(`working on ${cwd}`);

function* walk(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      yield* walk(filePath);
    } else {
      yield filePath;
    }
  }
}

function apply({
  validator = _file => true,
  source,
  destination,
  destinationTransformer = null,
  overwrite = false,
}) {
  console.log(`[${cwd}] copying files from ${source} to ${destination}`);
  if (!source) throw new Error(`source is required`);
  if (!destination && !destinationTransformer)
    throw new Error(`destination or destinationTransformer is required`);

  for (const file of walk(source)) {
    if (validator(file)) {
      const destinationFile = destinationTransformer
        ? destinationTransformer(file)
        : path.join(destination, path.relative(source, file));
      if (fs.existsSync(destinationFile) && !overwrite) {
        console.debug(`skipping ${file}`);
        continue;
      }
      fs.mkdirSync(path.dirname(destinationFile), { recursive: true });
      fs.copyFileSync(file, destinationFile);
    }
  }

  return true;
}

apply({
  source: `src`,
  destination: `dist`,
  validator: file => !(file.endsWith(`.js`) || file.endsWith(`.ts`)),
});
