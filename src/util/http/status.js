import httpStatus from "http-status";

function isOperational(status) {
  return status >= 200 && status < 300;
}

function getDescription(status) {
  const s = httpStatus[status];
  if (!s) throw new Error(`Recieved invalid status ${status}`);
  return s;
}

export { isOperational, getDescription };
