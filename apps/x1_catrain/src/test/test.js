function main()
{
    console.log('Test object props');
    const testOpt = {
        test()
        {
            let result = [];
            for(let i = 100; i >= 0; --i)
            {
                let obj = {
                    a: 100 * 100,
                    b: 'WOOT',
                    c: function()
                    {
                        console.log('WOOT');
                        return obj;
                    }
                };
                /*
                obj.a = 100 * 100;
                obj.b = 'WOOT';
                obj.c = function()
                {
                    console.log('WOOT');
                    return obj;
                }
                */
                result.push(obj);
            }
        }
    };
    benchmark(testOpt);
    benchmark(testOpt);
    benchmark(testOpt);
}

function benchmark(opts = {})
{
    const { name, test, setup, teardown } = opts;

    if ('TEST_COUNT' in benchmark)
    {
        ++benchmark.TEST_COUNT;
    }
    else
    {
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
    do
    {
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

        if (Date.now() >= expectedRunTime)
        {
            break;
        }
    }
    while(true);
    const nextMems = process.memoryUsage();
    const deltaMems = {
        heapUsed: (nextMems.heapUsed - initialMems.heapUsed) / 1000,
        heapTotal: (nextMems.heapTotal - initialMems.heapTotal) / 1000,
    };
    // console.log(`HeapUsed: ${deltaMems.heapUsed.toFixed(3)}KB/${deltaMems.heapTotal.toFixed(3)}KB`);

    let millis = seconds * 1_000 + nanos / 1_000_000;
    let average = millis / i;
    console.log(`...Completed: ${seconds}s+${nanos}ns | ${i} steps | ${average.toFixed(3)}ms per step`);
}

main();

/*

add() many for multiple
Running test Test#1...
...Completed: 0s+4668602215ns | 12857 steps | 0.363ms per step
Running test Test#2...
...Completed: 0s+4691959877ns | 13882 steps | 0.338ms per step
Running test Test#3...
...Completed: 0s+4721777659ns | 12526 steps | 0.377ms per step

addMultiple() many for multiple
Running test Test#1...
...Completed: 0s+4762876741ns | 6731 steps | 0.708ms per step
Running test Test#2...
...Completed: 0s+4787396907ns | 6044 steps | 0.792ms per step
Running test Test#3...
...Completed: 0s+4808808272ns | 5822 steps | 0.826ms per step

addMultiple() one for multiple
Running test Test#1...
...Completed: 0s+4528860027ns | 22411 steps | 0.202ms per step
Running test Test#2...
...Completed: 0s+4542964278ns | 14536 steps | 0.313ms per step
Running test Test#3...
...Completed: 0s+4553499582ns | 16656 steps | 0.273ms per step
andrew@Andrews-MacBook-Pro milque % 

*/
