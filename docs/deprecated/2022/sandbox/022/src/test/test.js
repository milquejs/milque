function createGameObject(props) {
  const { x = 3, y = 0, z = 0 } = props;
  return {
    x: Math.pow(x, 2),
    y: y + Math.pow(x, 3),
    z: z + Math.pow(x, 4),
  };
}

function main() {
  console.log('Test object create function');
  const testOpt = {
    test() {
      let result = [];
      for (let i = 100000; i >= 0; --i) {
        let obj = createGameObject({ x: 10, y: 10 });
        //let obj = new GameObject({ x: 10, y: 10 });
        result.push(obj);
      }
      for (let r of result) {
        r.x += 1;
      }
    },
  };
  benchmark(testOpt);
  benchmark(testOpt);
  benchmark(testOpt);
}

function benchmark(opts = {}) {
  const { name, test, setup, teardown } = opts;

  if ('TEST_COUNT' in benchmark) {
    ++benchmark.TEST_COUNT;
  } else {
    benchmark.TEST_COUNT = 1;
  }
  const testName = 'Test#' + benchmark.TEST_COUNT;

  console.log(`Running test ${testName}...`);
  let expectedRunTime = Date.now() + 5000;
  let seconds = 0;
  let nanos = 0;
  let i = 0;
  let ctx = {};
  const initialMems = process.memoryUsage();
  do {
    ++i;
    if (setup) setup.call(ctx);
    let t = process.hrtime();
    {
      test.call(ctx);
    }
    t = process.hrtime(t);
    if (teardown) teardown.call(ctx);
    seconds += t[0];
    nanos += t[1];

    if (Date.now() >= expectedRunTime) {
      break;
    }
  } while (true);
  const nextMems = process.memoryUsage();
  const deltaMems = {
    heapUsed: (nextMems.heapUsed - initialMems.heapUsed) / 1000,
    heapTotal: (nextMems.heapTotal - initialMems.heapTotal) / 1000,
  };
  // console.log(`HeapUsed: ${deltaMems.heapUsed.toFixed(3)}KB/${deltaMems.heapTotal.toFixed(3)}KB`);

  let millis = seconds * 1_000 + nanos / 1_000_000;
  let average = millis / i;
  console.log(
    `...Completed: ${seconds}s+${nanos}ns | ${i} steps | ${average.toFixed(
      3
    )}ms per step`
  );
}

main();

/*

Test object create function
Running test Test#1...
...Completed: 0s+4932732625ns | 17907 steps | 0.275ms per step
Running test Test#2...
...Completed: 0s+4960628512ns | 24563 steps | 0.202ms per step
Running test Test#3...
...Completed: 0s+4974253895ns | 25514 steps | 0.195ms per step

*/
