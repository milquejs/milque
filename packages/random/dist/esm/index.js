class RandomGenerator {
  /** @abstract */
  next() {
    return Math.random();
  }

}

let RAND;
class Random {
  constructor(randomGenerator = new RandomGenerator()) {
    this.generator = randomGenerator;
  }

  static next() {
    return RAND.next();
  }

  next() {
    return this.generator.next();
  }

  static choose(list) {
    return RAND.choose(list);
  }

  choose(list) {
    return list[Math.floor(this.generator.next() * list.length)];
  }

  static range(min, max) {
    return RAND.range(min, max);
  }

  range(min, max) {
    return (max - min) * this.generator.next() + min;
  }

  static sign() {
    return RAND.sign();
  }

  sign() {
    return this.generator.next() < 0.5 ? -1 : 1;
  }

}
RAND = new Random();

class SimpleRandomGenerator extends RandomGenerator {
  constructor(seed = 0) {
    super();
    /** @private */

    this._seed = Math.abs(seed % 2147483647);
    /** @private */

    this._next = this._seed;
  }
  /** @override */


  next() {
    this._next = Math.abs(this._next * 16807 % 2147483647 - 1);
    return this._next / 2147483646;
  }

  get seed() {
    return this._seed;
  }

  set seed(value) {
    this._seed = Math.abs(value % 2147483647);
    this._next = this._seed;
  }

}

export { Random, RandomGenerator, SimpleRandomGenerator };
