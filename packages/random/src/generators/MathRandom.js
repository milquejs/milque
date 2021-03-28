import { RandomBase } from './RandomBase.js';

export class MathRandom extends RandomBase
{
    /** @override */
    next()
    {
        return Math.random();
    }
}
