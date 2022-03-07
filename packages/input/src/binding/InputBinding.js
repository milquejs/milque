export class InputBinding {
  /** @returns {boolean} */
  get polling() {
    if (!this.ref) {
      return false;
    }
    return this.ref.polling;
  }

  /** @returns {number} */
  get value() {
    if (!this.ref) {
      return 0;
    }
    return this.ref.value;
  }

  /**
   * @param {string} name
   */
  constructor(name) {
    /** @protected */
    this.name = name;

    /** @protected */
    this.ref = null;
  }

  /**
   * @abstract
   * @param {import('../InputContext.js').InputContext} inputContext
   */
  register(inputContext) {
    throw new Error('Unsupported operation.');
  }

  /**
   * @param {number} code
   * @returns {number}
   */
  getState(code) {
    if (!this.ref) {
      return 0;
    }
    return this.ref.getState(code);
  }
}
