function normalize(s) {
  return s
    .toLowerCase()
    .normalize(`NFD`)
    .replace(/[\u0300-\u036f]/g, ``);
}

export default normalize;
