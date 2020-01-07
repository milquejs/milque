import { SimpleRandomGenerator } from '../random/generators/SimpleRandomGenerator.js';
import { RandomGenerator } from '../random/generators/RandomGenerator.js';

const DEFAULT_RNG = new RandomGenerator();

export function createRandom(seed = 0)
{
    return new SimpleRandomGenerator(seed);
}

export function random()
{
    return DEFAULT_RNG.random();
}

export function randomRange(min, max)
{
    return DEFAULT_RNG.randomRange(min, max);
}

export function randomChoose(choices)
{
    return DEFAULT_RNG.randomChoose(choices);
}

export function randomSign()
{
    return DEFAULT_RNG.randomSign();
}