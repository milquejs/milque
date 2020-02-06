export class RandomInterface
{
    constructor(generator)
    {
        this.generator = generator;
    }

    next() { return this.generator.next(); }

    choose(list)
    {
        return list[Math.floor(this.next() * list.length)];
    }

    range(min, max)
    {
        return ((max - min) * this.next()) + min;
    }

    sign()
    {
        return this.next() < 0.5 ? -1 : 1;
    }
}
