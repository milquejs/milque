import { RandomGenerator } from './generators/RandomGenerator.js';
import { SimpleRandomGenerator } from './generators/SimpleRandomGenerator.js';

import { RandomInterface } from './RandomInterface.js';

class DefaultRandomInterface extends RandomInterface
{
    constructor() { super(new RandomGenerator()); }

    withGenerator(generator) { return new RandomInterface(generator); }
    withSeed(seed) { return new RandomInterface(new SimpleRandomGenerator(seed)); }
}

export const DEFAULT_RANDOM_INTERFACE = new DefaultRandomInterface();
