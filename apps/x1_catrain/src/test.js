const WILDCARD_KEY = '*';
class InputCodeMap
{
    constructor()
    {
        this.wildcards = {
            [WILDCARD_KEY]: false,
            Keyboard: false,
            Mouse: false,
        };
        this.entries = {
            [WILDCARD_KEY]: { [WILDCARD_KEY]: [] },
            Keyboard: { [WILDCARD_KEY]: [] },
            Mouse: { [WILDCARD_KEY]: [] },
        };
    }

    set(deviceMatcher, keyCodeMatcher, value)
    {
        if (!this.wildcards[deviceMatcher] && (deviceMatcher === WILDCARD_KEY || keyCodeMatcher === WILDCARD_KEY))
        {
            this.wildcards[deviceMatcher] = true;
        }
        return this.entries[deviceMatcher][keyCodeMatcher] = value;
    }

    get(device, keyCode)
    {
        return this.entries[device][keyCode];
    }

    getAll(out, device, keyCode)
    {
        /*
        let deviceMap = this.entries[device];
        if (keyCode in deviceMap) out.push(deviceMap[keyCode]);
        if (this.wildcards[device]) out.push(deviceMap[WILDCARD_KEY]);
        if (this.wildcards[WILDCARD_KEY])
        {
            let wildMap = this.entries[WILDCARD_KEY];
            if (keyCode in wildMap) out.push(wildMap[keyCode]);
            out.push(wildMap[WILDCARD_KEY]);
        }
        */
        let deviceMap = this.entries[device];
        if (keyCode in deviceMap) out.push(deviceMap[keyCode]);
        out.push(deviceMap[WILDCARD_KEY]);
        let wildMap = this.entries[WILDCARD_KEY];
        if (keyCode in wildMap) out.push(wildMap[keyCode]);
        out.push(wildMap[WILDCARD_KEY]);
        return out;
    }

    has(device, keyCode)
    {
        return device in this.entries && keyCode in this.entries[device];
    }
}

main();

function main()
{
    const testOpt = {
        test()
        {
            const { target } = this;
            let results = target.getAll([], 'Mouse', 'DeltaX');
            let sum = 0;
            for(let result of results)
            {
                for(let item of result)
                {
                    sum += item;
                }
            }
        },
        setup()
        {
            this.target = new InputCodeMap();
            this.target.set('Mouse', 'DeltaX', [1, 1, 1]);
            // this.target.set('Mouse', '*', [2]);
            // this.target.set('*', 'DeltaX', [3]);
            // this.target.set('*', '*', [4]);
        },
        teardown()
        {
        }
    };
    benchmark(testOpt);
    benchmark(testOpt);
    benchmark(testOpt);
}

function benchmark(opts = {})
{
    const { test, setup, teardown } = opts;

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
