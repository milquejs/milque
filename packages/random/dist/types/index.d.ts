/**
 * @typedef RandomGeneratorLike
 * @property {NumberFunction} next
 *
 * @callback NumberFunction Generates a pseudo-random number
 * from 0 inclusive to 1 exclusive.
 * @returns {number} A pseudo-randomly generated number.
 */
/**
 * Represents a pseudo-random number generator. This is only used for
 * type information.
 *
 * All random number generator instances are expected to implement
 * {@link RandomGeneratorLike}. If using classes, you can extend
 * {@link RandomBase} to enforce this, but this should not necessary
 * nor assumed.
 */
declare class RandomBase$1 {
    /**
     * Generates a pseudo-random number from 0 inclusive to 1 exclusive.
     *
     * @abstract
     * @returns {number} A pseudo-randomly generated number.
     */
    next(): number;
}
type RandomGeneratorLike$1 = {
    next: NumberFunction;
};
/**
 * Generates a pseudo-random number
 * from 0 inclusive to 1 exclusive.
 */
type NumberFunction = () => number;

/**
 * @typedef {import('./generators/RandomBase.js').RandomGeneratorLike} RandomGeneratorLike
 * @typedef {import('./generators/RandomBase.js').RandomBase} RandomBase
 */
declare class Random {
    /**
     * The lazily-initiated, static instance of this random class.
     */
    static get RAND(): Random;
    static next(): number;
    /**
     * @template T
     * @param {Array<T>} list
     * @returns {T}
     */
    static choose<T_1>(list: T_1[]): T_1;
    /**
     * @param {number} min Min range (inclusive)
     * @param {number} max Max range (exclusive)
     * @returns {number}
     */
    static range(min: number, max: number): number;
    /**
     * @param {number} min Min integer range (inclusive)
     * @param {number} max Max integer range (exclusive)
     * @returns {number}
     */
    static rangeInt(min: number, max: number): number;
    /**
     * @returns {-1|1}
     */
    static sign(): -1 | 1;
    /**
     * @param {RandomGeneratorLike|RandomBase|number} [randomGenerator]
     * If number type, the param will be used as a seed for a Mulberry32 PRNG.
     * Otherwise, it is the pseudo-random number generator object that provides
     * the generated numbers through `next()`. By default, if undefined, this
     * will use the browser-specific `Math.random()` implementation.
     */
    constructor(randomGenerator?: RandomGeneratorLike | RandomBase | number);
    generator: RandomBase$1;
    next(): number;
    /**
     * @template T
     * @param {Array<T>} list
     * @returns {T}
     */
    choose<T>(list: T[]): T;
    /**
     * @param {number} min Min range (inclusive)
     * @param {number} max Max range (exclusive)
     * @returns {number}
     */
    range(min: number, max: number): number;
    /**
     * @param {number} min Min integer range (inclusive)
     * @param {number} max Max integer range (exclusive)
     * @returns {number}
     */
    rangeInt(min: number, max: number): number;
    /**
     * @returns {-1|1}
     */
    sign(): -1 | 1;
}
type RandomGeneratorLike = RandomGeneratorLike$1;
type RandomBase = RandomBase$1;

declare class MathRandom extends RandomBase$1 {
}

/**
 * A simple and fast 32-bit PRNG.
 *
 * @see {@link https://github.com/bryc/code/blob/master/jshash/PRNGs.md}
 */
declare class Mulberry32 extends RandomBase$1 {
    /**
     * @param {number} seed An unsigned 32-bit integer.
     */
    constructor(seed: number);
    seed: number;
    /** @private */
    private a;
}

/**
 * A very fast 32-bit PRNG.
 *
 * @see https://github.com/bryc/code/blob/master/jshash/PRNGs.md
 */
declare class SmallFastCounter32 extends RandomBase$1 {
    /**
     * @param {number} a An unsigned 32-bit integer.
     * @param {number} b An unsigned 32-bit integer.
     * @param {number} c An unsigned 32-bit integer.
     * @param {number} d An unsigned 32-bit integer.
     */
    constructor(a: number, b: number, c: number, d: number);
    /** @private */
    private a;
    /** @private */
    private b;
    /** @private */
    private c;
    /** @private */
    private d;
}

export { MathRandom, Mulberry32, Random, RandomBase$1 as RandomBase, SmallFastCounter32 };
