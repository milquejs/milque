import { makeRe } from 'picomatch';

export class GlobExp {
  /**
   * @param {string|GlobExp} pattern
   */
  constructor(pattern) {
    let source;
    if (typeof pattern === 'object' && pattern instanceof GlobExp) {
      source = String(pattern.source);
    } else {
      source = String(pattern);
    }
    /** @type {string} */
    this.source = source;

    /** @private */
    this.re = makeRe(source);
  }

  /**
   * @param {string} string
   * @returns {boolean}
   */
  test(string) {
    return this.re.test(string);
  }
}
