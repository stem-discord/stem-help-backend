import httpStatus from "http-status";

class ApiError extends Error {
  constructor(statusCode, message, isOperational = true, stack = ``) {
    if (httpStatus[statusCode] === undefined) {
      throw new Error(`Status code must be provided for ApiErrors`);
    }
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default ApiError;
