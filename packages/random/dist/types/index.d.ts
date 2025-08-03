/** @abstract */
declare class RandomGenerator {
    /**
     * Returns a pseudorandom number between 0 and 1.
     *
     * @abstract
     * @returns {number}
     */
    random(): number;
    /**
     * @returns {number}
     */
    nextFloat(): number;
    /**
     * @returns {boolean}
     */
    nextBoolean(): boolean;
    /**
     * @param {number} max
     * @returns {number}
     */
    nextInt(max?: number): number;
    /**
     * @readonly
     * @param {number} from
     * @param {number} to
     */
    readonly range(from: number, to: number): number;
    /**
     * @readonly
     * @param {number} from
     * @param {number} to
     */
    readonly rangeInt(from: number, to: number): number;
    /**
     * @readonly
     */
    readonly sign(): 1 | -1;
    /**
     * @readonly
     * @template T
     * @param  {...T} items
     * @returns {T}
     */
    readonly choose<T>(...items: T[]): T;
}

declare class MathRandom extends RandomGenerator {
}

/**
 * A simple and fast 32-bit PRNG.
 *
 * @see {@link https://github.com/bryc/code/blob/master/jshash/PRNGs.md}
 */
declare class Mulberry32 extends RandomGenerator {
    /**
     * @param {number} seed An unsigned 32-bit integer.
     */
    constructor(seed: number);
    seed: number;
    /** @private */
    private a;
    /**
     * @param {number} seed
     */
    setSeed(seed: number): this;
}

/**
 * A very fast 32-bit PRNG.
 *
 * @see https://github.com/bryc/code/blob/master/jshash/PRNGs.md
 */
declare class SmallFastCounter32 extends RandomGenerator {
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

declare const Random: MathRandom;

export { MathRandom, Mulberry32, Random, RandomGenerator, SmallFastCounter32 };
