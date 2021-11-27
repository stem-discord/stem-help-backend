import { createBenchmarkSuite } from './benchmark.js';

const suite = createBenchmarkSuite();

import { normalize } from '../src/util';

suite.add(`normalize test`, function() {
  // eslint-disable-next-line quotes
  normalize("Crème Brulée");
});

