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
export class RandomBase {
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
