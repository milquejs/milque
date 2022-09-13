'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

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
class RandomBase {
  /**
   * Generates a pseudo-random number from 0 inclusive to 1 exclusive.
   *
   * @abstract
   * @returns {number} A pseudo-randomly generated number.
   */
  next() {
    return 0;
  }
}

class MathRandom extends RandomBase {
  /** @override */
  next() {
    return Math.random();
  }
}

/**
 * A simple and fast 32-bit PRNG.
 *
 * @see {@link https://github.com/bryc/code/blob/master/jshash/PRNGs.md}
 */
class Mulberry32 extends RandomBase {
  /**
   * @param {number} seed An unsigned 32-bit integer.
   */
  constructor(seed) {
    super();

    this.seed = seed;

    /** @private */
    this.a = seed;
  }

  /** @override */
  next() {
    var t = (this.a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }
}

/**
 * @typedef {import('./generators/RandomBase.js').RandomGeneratorLike} RandomGeneratorLike
 * @typedef {import('./generators/RandomBase.js').RandomBase} RandomBase
 */

class Random {
  /**
   * The lazily-initiated, static instance of this random class.
   */
  static get RAND() {
    let instance = new this();

    this.next = this.next.bind(this);
    this.choose = this.choose.bind(this);
    this.range = this.range.bind(this);
    this.rangeInt = this.rangeInt.bind(this);
    this.sign = this.sign.bind(this);

    Object.defineProperty(this, 'RAND', { value: instance });
    return instance;
  }

  /**
   * @param {RandomGeneratorLike|RandomBase|number} [randomGenerator]
   * If number type, the param will be used as a seed for a Mulberry32 PRNG.
   * Otherwise, it is the pseudo-random number generator object that provides
   * the generated numbers through `next()`. By default, if undefined, this
   * will use the browser-specific `Math.random()` implementation.
   */
  constructor(randomGenerator = undefined) {
    if (typeof randomGenerator === 'number') {
      this.generator = new Mulberry32(randomGenerator);
    } else if (randomGenerator) {
      this.generator = randomGenerator;
    } else {
      this.generator = new MathRandom();
    }

    this.next = this.next.bind(this);
    this.choose = this.choose.bind(this);
    this.range = this.range.bind(this);
    this.rangeInt = this.rangeInt.bind(this);
    this.sign = this.sign.bind(this);
  }

  static next() {
    return this.RAND.next();
  }
  next() {
    return this.generator.next();
  }

  /**
   * @template T
   * @param {Array<T>} list
   * @returns {T}
   */
  static choose(list) {
    return this.RAND.choose(list);
  }
  /**
   * @template T
   * @param {Array<T>} list
   * @returns {T}
   */
  choose(list) {
    return list[Math.floor(this.generator.next() * list.length)];
  }

  /**
   * @param {number} min Min range (inclusive)
   * @param {number} max Max range (exclusive)
   * @returns {number}
   */
  static range(min, max) {
    return this.RAND.range(min, max);
  }
  /**
   * @param {number} min Min range (inclusive)
   * @param {number} max Max range (exclusive)
   * @returns {number}
   */
  range(min, max) {
    return (max - min) * this.generator.next() + min;
  }

  /**
   * @param {number} min Min integer range (inclusive)
   * @param {number} max Max integer range (exclusive)
   * @returns {number}
   */
  static rangeInt(min, max) {
    return this.RAND.rangeInt(min, max);
  }
  /**
   * @param {number} min Min integer range (inclusive)
   * @param {number} max Max integer range (exclusive)
   * @returns {number}
   */
  rangeInt(min, max) {
    return Math.trunc(this.range(min, max));
  }

  /**
   * @returns {-1|1}
   */
  static sign() {
    return this.RAND.sign();
  }
  /**
   * @returns {-1|1}
   */
  sign() {
    return this.generator.next() < 0.5 ? -1 : 1;
  }
}

/**
 * A very fast 32-bit PRNG.
 *
 * @see https://github.com/bryc/code/blob/master/jshash/PRNGs.md
 */
class SmallFastCounter32 extends RandomBase {
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
  next() {
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

exports.MathRandom = MathRandom;
exports.Mulberry32 = Mulberry32;
exports.Random = Random;
exports.RandomBase = RandomBase;
exports.SmallFastCounter32 = SmallFastCounter32;
