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

export async function getHeadDiff(ops) {
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

export async function getBranchDiff(a, b, ops) {
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

export async function getUnstagedDiff(ops) {
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
