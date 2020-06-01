import { RandomGenerator } from './generators/RandomGenerator.js';

const RAND = new RandomGenerator();

export function next()
{
    return RAND.next();
}

export function choose(list)
{
    return list[Math.floor(RAND.next() * list.length)];
}

export function range(min, max)
{
    return ((max - min) * RAND.next()) + min;
}

export function sign()
{
    return RAND.next() < 0.5 ? -1 : 1;
}
