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
    if (!this.ref || this.disabled) {
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

    /** @protected */
    this.disabled = false;
  }

  /**
   * @abstract
   * @param {import('../InputContext.js').InputContext} inputContext
   */
  bindTo(inputContext) {
    throw new Error('Unsupported operation.');
  }

  disable(force = true) {
    this.disabled = force;
    return this;
  }

  /**
   * @param {number} code
   * @returns {number}
   */
  getState(code) {
    if (!this.ref || this.disabled) {
      return 0;
    }
    return this.ref.getState(code);
  }
}
