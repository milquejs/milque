/** @abstract */
export class RandomGenerator {
  
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
   * @param {number} _seed 
   * @returns {RandomGenerator}
   */
  setSeed(_seed) {
    throw new Error('This random generator does not support seeded values.');
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
