
// stored in this script
let count = 0;

const words = [
  `got here`,
  `aaaa`,
  `bbbb`,
  `123 123`,
  `asigajodlskfmn`,
];

function generate() {
  count++;
  count %= words.length;
  return words[count];
}

module.exports = generate;
