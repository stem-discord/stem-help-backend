import Benchmark from "benchmark";

export function createBenchmarkSuite() {
  const suite = new Benchmark.Suite;

  suite.on(`cycle`, function(event) {
    console.log(String(event.target));
  }).on(`complete`, function() {
    console.log(`Fastest is ` + this.filter(`fastest`).map(`name`));
  });

  process.nextTick(() => {
    console.log(`comparing [${suite.map(bench => bench.name).join(`, `)}]`);
    suite.run();
  });

  return suite;
}
