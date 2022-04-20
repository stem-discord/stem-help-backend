import { exec } from "child_process";

export async function getBranch() {
  return new Promise((res, rej) => {
    exec(`git rev-parse --abbrev-ref HEAD`, (err, stdout, stderr) => {
      if (err || stderr) {
        rej(err || stderr);
      }
      // replace trailing whitespaces and new lines
      res(stdout.replace(/\s+$/, ``));
    });
  });
}

export async function getFileCount() {
  return new Promise((res, rej) => {
    exec(`git ls-files`, (err, stdout, stderr) => {
      if (err || stderr) {
        rej(err || stderr);
      }
      res(stdout.match(/\n/g)?.length ?? 0);
    });
  });
}

export async function getLastCommit() {
  return new Promise((res, rej) => {
    exec(`git log --format=%H -n 1`, (err, stdout, stderr) => {
      if (err || stderr) {
        rej(err || stderr);
      }
      res(stdout.slice(0, 8));
    });
  });
}

export async function getHeadDiff(ops: string) {
  return new Promise((res, rej) => {
    ops = ops ?? `--compact-summary`;
    exec(`git diff origin/HEAD HEAD ${ops}`, (err, stdout, stderr) => {
      if (err || stderr) {
        rej(err || stderr);
      }
      res(stdout);
    });
  });
}

export async function getBranchDiff(a: string, b: string, ops: string) {
  return new Promise((res, rej) => {
    ops = ops ?? `--compact-summary`;
    exec(`git diff origin/${a} ${b} ${ops}`, (err, stdout, stderr) => {
      if (err || stderr) {
        rej(err || stderr);
      }
      res(stdout);
    });
  });
}

export async function getUnstagedDiff(ops: string) {
  return new Promise((res, rej) => {
    ops = ops ?? `--compact-summary`;
    exec(`git diff ${ops}`, (err, stdout, stderr) => {
      if (err || stderr) {
        rej(err || stderr);
      }
      res(stdout);
    });
  });
}
