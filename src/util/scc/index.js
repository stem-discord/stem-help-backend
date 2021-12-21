import { exec } from "child_process";

export async function stats() {
  return new Promise((res, rej) => {
    exec(`scc --exclude-dir package-lock.json`, (err, stdout, stderr) => {
      if (err || stderr) {
        rej(err || stderr);
      }
      res(stdout);
    });
  });
}
