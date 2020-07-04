import { RandomGenerator } from './generators/RandomGenerator.js';

export class Random
{
    constructor(randomGenerator = new RandomGenerator())
    {
        this.generator = randomGenerator;
    }

    static next() { return this.RAND.next(); }
    next()
    {
        return this.generator.next();
    }

    static choose(list) { return this.RAND.choose(list); }
    choose(list)
    {
        return list[Math.floor(this.generator.next() * list.length)];
    }

    static range(min, max) { return this.RAND.range(min, max); }
    range(min, max)
    {
        return ((max - min) * this.generator.next()) + min;
    }
    
    static sign() { return this.RAND.sign(); }
    sign()
    {
        return this.generator.next() < 0.5 ? -1 : 1;
    }
}
Random.RAND = new Random();
