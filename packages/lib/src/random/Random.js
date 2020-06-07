import { RandomGenerator } from './generators/RandomGenerator.js';

export class Random
{
    constructor(randomGenerator = new RandomGenerator())
    {
        this.generator = randomGenerator;
    }

    next()
    {
        return this.generator.next();
    }

    choose(list)
    {
        return list[Math.floor(this.generator.next() * list.length)];
    }

    range(min, max)
    {
        return ((max - min) * this.generator.next()) + min;
    }
    
    sign()
    {
        return this.generator.next() < 0.5 ? -1 : 1;
    }
}

export const RAND = new Random();

export function next()
{
    return RAND.next();
}

export function choose(list)
{
    return RAND.choose(list);
}

export function range(min, max)
{
    return RAND.range(min, max);
}

export function sign()
{
    return RAND.sign();
}
