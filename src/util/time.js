export default (function (time) {
  time = time ?? new Date();
  return [time.getHours(), time.getMinutes(), time.getSeconds()]
    .map(v => `${v}`.padStart(2, `0`))
    .join(`:`);
});
