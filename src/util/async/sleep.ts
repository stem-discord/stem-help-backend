export default (t: number) =>
  new Promise(r => {
    setTimeout(r, t);
  });
