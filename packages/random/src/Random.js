import { RandomGenerator } from './generators/RandomGenerator.js';

let RAND;

export class Random
{
    constructor(randomGenerator = new RandomGenerator())
    {
        this.generator = randomGenerator;
    }

    static next() { return RAND.next(); }
    next()
    {
        return this.generator.next();
    }

    static choose(list) { return RAND.choose(list); }
    choose(list)
    {
        return list[Math.floor(this.generator.next() * list.length)];
    }

    static range(min, max) { return RAND.range(min, max); }
    range(min, max)
    {
        return ((max - min) * this.generator.next()) + min;
    }
    
    static sign() { return RAND.sign(); }
    sign()
    {
        return this.generator.next() < 0.5 ? -1 : 1;
    }
}

RAND = new Random();
