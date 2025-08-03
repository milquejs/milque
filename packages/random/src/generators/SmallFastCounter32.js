import { RandomGenerator } from './RandomGenerator';

/**
 * A very fast 32-bit PRNG.
 *
 * @see https://github.com/bryc/code/blob/master/jshash/PRNGs.md
 */
export class SmallFastCounter32 extends RandomGenerator {
  /**
   * @param {number} a An unsigned 32-bit integer.
   * @param {number} b An unsigned 32-bit integer.
   * @param {number} c An unsigned 32-bit integer.
   * @param {number} d An unsigned 32-bit integer.
   */
  constructor(a, b, c, d) {
    super();

    /** @private */
    this.a = a;
    /** @private */
    this.b = b;
    /** @private */
    this.c = c;
    /** @private */
    this.d = d;
  }

  /** @override */
  random() {
    let { a, b, c, d } = this;
    a |= 0;
    b |= 0;
    c |= 0;
    d |= 0;
    let t = (((a + b) | 0) + d) | 0;
    d = (d + 1) | 0;
    a = b ^ (b >>> 9);
    b = (c + (c << 3)) | 0;
    c = (c << 21) | (c >>> 11);
    c = (c + t) | 0;
    this.a = a;
    this.b = b;
    this.c = c;
    this.d = d;
    return (t >>> 0) / 4294967296;
  }
}
