const now = Date.now();

/**
 * @param {Date} time
 * keeps an internal "now"
 */
function startTime(time) {
  time = time === undefined ? new Date() : new Date(time);
  time -= now;
  time %= 24 * 60 * 60 * 1000;
  const hour = Math.floor(time / (60 * 60 * 1000));
  time %= 60 * 60 * 1000;
  const minute = Math.floor(time / ( 60 * 1000));
  time %= 60 * 1000;
  const second = Math.floor(time / 1000);
  return [hour, minute, second]
    .map(v => `${v}`.padStart(2, `0`))
    .join(`:`);
}

/**
 * @param {Date} time
 */
function localeTime(time) {
  time = time === undefined ? new Date() : new Date(time);
  return [time.getHours(), time.getMinutes(), time.getSeconds()]
    .map(v => `${v}`.padStart(2, `0`))
    .join(`:`);
}

export { startTime, localeTime };
