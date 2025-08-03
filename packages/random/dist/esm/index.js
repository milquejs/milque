/** @abstract */
class RandomGenerator {
  
  /**
   * Returns a pseudorandom number between 0 and 1.
   * 
   * @abstract
   * @returns {number}
   */
  random() {
    throw new Error('Not yet implemented.');
  }

  /**
   * @returns {number}
   */
  nextFloat() {
    return this.random();
  }

  /**
   * @returns {boolean}
   */
  nextBoolean() {
    return this.random() >= 0.5;
  }

  /**
   * @param {number} max 
   * @returns {number}
   */
  nextInt(max = 1) {
    return Math.trunc(this.random() * max);
  }

  /**
   * @readonly
   * @param {number} from 
   * @param {number} to
   */
  range(from, to) {
    return from + this.nextFloat() * (to - from);
  }

  /**
   * @readonly
   * @param {number} from 
   * @param {number} to
   */
  rangeInt(from, to) {
    return Math.trunc(this.range(from, to));
  }

  /**
   * @readonly
   */
  sign() {
    return this.nextBoolean() ? 1 : -1;
  }

  /**
   * @readonly
   * @template T
   * @param  {...T} items 
   * @returns {T}
   */
  choose(...items) {
    let i = Math.trunc(this.range(0, items.length));
    return items[i];
  }
}

class MathRandom extends RandomGenerator {
  /** @override */
  random() {
    return Math.random();
  }
}

/**
 * A simple and fast 32-bit PRNG.
 *
 * @see {@link https://github.com/bryc/code/blob/master/jshash/PRNGs.md}
 */
class Mulberry32 extends RandomGenerator {
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

/**
 * A very fast 32-bit PRNG.
 *
 * @see https://github.com/bryc/code/blob/master/jshash/PRNGs.md
 */
class SmallFastCounter32 extends RandomGenerator {
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

const Random = new MathRandom();

export { MathRandom, Mulberry32, Random, RandomGenerator, SmallFastCounter32 };
//# sourceMappingURL=index.js.map
