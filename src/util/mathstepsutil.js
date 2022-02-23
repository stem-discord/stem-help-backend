import mathsteps from "mathsteps";

function humanize(s) {
  return s.replace(/_/g, ` `).toLowerCase();
}

function explain(eq) {
  let steps, type, convert;
  if (eq.includes(`=`)) {
    steps = mathsteps.solveEquation(eq);
    type = `newEquation`;
    convert = `ascii`;
  } else {
    steps = mathsteps.simplifyExpression(eq);
    type = `newNode`;
    convert = `toString`;
  }

  if (steps.length === 0) {
    return null;
  }

  const res = [`given: ${eq}`];

  let step;

  for (step of steps) {
    if (step.substeps.length < 2) continue;
    res.push(`${step.changeType} ${step[type][convert]()}`);
  }

  res.push(`result: ${step[type][convert]()}`);

  return humanize(res.join(`\n`));
}

export { explain };
