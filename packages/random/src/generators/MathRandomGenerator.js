import { RandomNumberGeneratorBase } from './RandomNumberGeneratorBase.js';

export class MathRandomGenerator extends RandomNumberGeneratorBase
{
    /** @override */
    next()
    {
        return Math.random();
    }
}
