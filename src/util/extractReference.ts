function extractReference(obj: Record<string, unknown>, path: string): unknown {
  return path.split(`.`).reduce((o, i) => o[i], obj);
}

export default extractReference;
