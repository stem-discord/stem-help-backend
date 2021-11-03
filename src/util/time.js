const now = Date.now();

function startTime(time) {
  time = time ?? new Date();
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

function localeTime(time) {
  time = time ?? new Date();
  return [time.getHours(), time.getMinutes(), time.getSeconds()]
    .map(v => `${v}`.padStart(2, `0`))
    .join(`:`);
}

export { startTime, localeTime };

export default localeTime;
