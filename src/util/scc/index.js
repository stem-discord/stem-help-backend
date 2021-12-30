import { exec } from "child_process";
import { sync } from "command-exists";

const isSccInstalled = sync(`scc`);

let sccCache;

export async function stats() {
  if (!isSccInstalled) return `<SCC information not available>`;
  return (
    sccCache ??
    (sccCache = new Promise((res, rej) => {
      exec(`scc --exclude-dir package-lock.json`, (err, stdout, stderr) => {
        if (err || stderr) {
          rej(err || stderr);
        }
        res(stdout);
      });
    }))
  );
}
