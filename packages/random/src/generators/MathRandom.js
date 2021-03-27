import { RandomNumberGeneratorBase } from './RandomNumberGeneratorBase.js';

export class MathRandom extends RandomNumberGeneratorBase
{
    /** @override */
    next()
    {
        return Math.random();
    }
}
