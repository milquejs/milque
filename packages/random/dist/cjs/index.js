'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

class RandomNumberGeneratorBase {
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

class MathRandom extends RandomNumberGeneratorBase {
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

class Mulberry32 extends RandomNumberGeneratorBase {
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
    var t = this.a += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  }

}

class Random {
  /**
   * The lazily-initiated, static instance of this random class.
   * 
   * @protected
   */
  static get RAND() {
    let instance = new this();
    Object.defineProperty(this, 'RAND', {
      value: instance
    });
    return instance;
  }
  /**
   * @param {RandomNumberGeneratorBase|number} [randomGenerator] If typeof number,
   * the param will be used as a seed for a Mulberry32 PRNG. Otherwise,
   * it is the pseudo-random number generator object that provides the
   * generated numbers through `next()`. By default, this will use the
   * browser-specific `Math.random()` implementation.
   */


  constructor(randomGenerator = undefined) {
    if (typeof randomGenerator === 'number') {
      this.generator = new Mulberry32(randomGenerator);
    } else if (randomGenerator) {
      this.generator = randomGenerator;
    } else {
      this.generator = new MathRandom();
    }
  }

  static next() {
    return this.RAND.next();
  }

  next() {
    return this.generator.next();
  }

  static choose(list) {
    return this.RAND.choose(list);
  }

  choose(list) {
    return list[Math.floor(this.generator.next() * list.length)];
  }

  static range(min, max) {
    return this.RAND.range(min, max);
  }

  range(min, max) {
    return (max - min) * this.generator.next() + min;
  }

  static rangeInt(min, max) {
    return this.RAND.rangeInt(min, max);
  }

  rangeInt(min, max) {
    return Math.trunc(this.range(min, max));
  }

  static sign() {
    return this.RAND.sign();
  }

  sign() {
    return this.generator.next() < 0.5 ? -1 : 1;
  }

}

/**
 * A very fast 32-bit PRNG.
 * 
 * @see {@link https://github.com/bryc/code/blob/master/jshash/PRNGs.md}
 */

class SmallFastCounter32 extends RandomNumberGeneratorBase {
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
    let {
      a,
      b,
      c,
      d
    } = this;
    a |= 0;
    b |= 0;
    c |= 0;
    d |= 0;
    let t = (a + b | 0) + d | 0;
    d = d + 1 | 0;
    a = b ^ b >>> 9;
    b = c + (c << 3) | 0;
    c = c << 21 | c >>> 11;
    c = c + t | 0;
    this.a = a;
    this.b = b;
    this.c = c;
    this.d = d;
    return (t >>> 0) / 4294967296;
  }

}

var index = /*#__PURE__*/Object.freeze({
    __proto__: null,
    RandomNumberGeneratorBase: RandomNumberGeneratorBase,
    MathRandom: MathRandom,
    Mulberry32: Mulberry32,
    SmallFastCounter32: SmallFastCounter32
});

exports.Random = Random;
exports.RandomNumberGenerators = index;
