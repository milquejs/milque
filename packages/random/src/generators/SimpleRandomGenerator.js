import { RandomGenerator } from './RandomGenerator.js';

// SOURCE: https://gist.github.com/blixt/f17b47c62508be59987b
export class SimpleRandomGenerator extends RandomGenerator
{
    constructor(seed = 0)
    {
        super();

        /** @private */
        this._seed = Math.abs(seed % 2147483647);
        /** @private */
        this._next = this._seed;
    }

    /** @override */
    next()
    {
        this._next = Math.abs(this._next * 16807 % 2147483647 - 1);
        return this._next / 2147483646;
    }

    get seed()
    {
        return this._seed;
    }

    set seed(value)
    {
        this._seed = Math.abs(value % 2147483647);
        this._next = this._seed;
    }
}
