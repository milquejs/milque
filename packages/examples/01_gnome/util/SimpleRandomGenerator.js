import { RandomGenerator } from './RandomGenerator.js';

// SOURCE: https://gist.github.com/blixt/f17b47c62508be59987b
export class SimpleRandomGenerator extends RandomGenerator
{
    constructor(seed = 0)
    {
        super(Math.abs(seed % 2147483647));
        
        this._next = this.seed;
    }

    /** @override */
    random()
    {
        this._next = this._next * 16807 % 2147483647;
        return (this._next - 1) / 2147483646;
    }
}
