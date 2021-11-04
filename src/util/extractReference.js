function extractReference(obj, path) {
  return path.split(`.`).reduce((o, i) => o[i], obj);
}

export default extractReference;
