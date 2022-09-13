import { MathRandom } from './generators/MathRandom.js';
import { Mulberry32 } from './generators/Mulberry32.js';

/**
 * @typedef {import('./generators/RandomBase.js').RandomGeneratorLike} RandomGeneratorLike
 * @typedef {import('./generators/RandomBase.js').RandomBase} RandomBase
 */

export class Random {
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
