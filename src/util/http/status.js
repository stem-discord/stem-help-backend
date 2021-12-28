import httpStatus from "http-status";

function isOperational(status) {
  if (status === undefined) {
    throw new Error(`status is required`);
  }

  status = Number(status);

  if (!Number.isInteger(status)) {
    throw new Error(`status must be an integer or integer string`);
  }

  return status >= 200 && status < 300;
}

function getDescription(status) {
  if (status === undefined) {
    throw new Error(`status is required`);
  }
  const s = httpStatus[status];
  if (!s) throw new Error(`Recieved invalid status ${status}`);
  return s;
}

export { isOperational, getDescription };
