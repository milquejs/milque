import { RandomGenerator } from './RandomGenerator';

export class MathRandom extends RandomGenerator {
  /** @override */
  random() {
    return Math.random();
  }
}
