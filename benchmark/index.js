import { createBenchmarkSuite } from './benchmark.js';

import normalize from '../src/util/normalize.js';

createBenchmarkSuite().add(`normalize test`, function() {
  // eslint-disable-next-line quotes
  normalize("Crème Brulée");
});

