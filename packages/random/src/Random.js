import { MathRandomGenerator } from './generators/MathRandomGenerator.js';
import { Mulberry32 } from './generators/Mulberry32.js';

export class Random
{
    /**
     * The lazily-initiated, static instance of this random class.
     * 
     * @protected
     */
    static get RAND()
    {
        let instance = new (this)();
        Object.defineProperty(this, 'RAND', { value: instance });
        return instance;
    }

    /**
     * @param {RandomNumberGeneratorBase|number} [randomGenerator] If typeof number,
     * the param will be used as a seed for a Mulberry32 PRNG. Otherwise,
     * it is the pseudo-random number generator object that provides the
     * generated numbers through `next()`. By default, this will use the
     * browser-specific `Math.random()` implementation.
     */
    constructor(randomGenerator = undefined)
    {
        if (typeof randomGenerator === 'number')
        {
            this.generator = new Mulberry32(randomGenerator);
        }
        else if (randomGenerator)
        {
            this.generator = randomGenerator;
        }
        else
        {
            this.generator = new MathRandomGenerator();
        }
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

    static rangeInt(min, max) { return this.RAND.rangeInt(min, max); }
    rangeInt(min, max)
    {
        return Math.trunc(this.range(min, max));
    }
    
    static sign() { return this.RAND.sign(); }
    sign()
    {
        return this.generator.next() < 0.5 ? -1 : 1;
    }
}
