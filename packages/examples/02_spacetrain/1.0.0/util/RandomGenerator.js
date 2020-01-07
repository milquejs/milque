export class RandomGenerator
{
    constructor(seed)
    {
        this._seed = seed;
    }

    get seed() { return this._seed; }

    random() { return Math.random(); }

    randomRange(min, max)
    {
        return this.random() * (max - min) + min;
    }

    randomChoose(choices)
    {
        return choices[Math.floor(this.random() * choices.length)];
    }

    randomSign()
    {
        return this.random() < 0.5 ? -1 : 1;
    }
}
