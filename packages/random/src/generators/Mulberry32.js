import { RandomGenerator } from './RandomGenerator';

/**
 * A simple and fast 32-bit PRNG.
 *
 * @see {@link https://github.com/bryc/code/blob/master/jshash/PRNGs.md}
 */
export class Mulberry32 extends RandomGenerator {
  /**
   * @param {number} seed An unsigned 32-bit integer.
   */
  constructor(seed) {
    super();

    this.seed = seed;

    /** @private */
    this.a = seed;
  }

  /**
   * @override
   * @param {number} seed 
   */
  setSeed(seed) {
    this.seed = seed;
    this.a = seed;
    return this;
  }

  /** @override */
  random() {
    var t = (this.a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }
}
