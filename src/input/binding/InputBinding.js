export class InputBinding {
  /**
   * @param {string} name
   */
  constructor(name) {
    this.name = name;
    /** @type {import('../state/InputState').InputState} */
    this.current = null;
  }

  /**
   * @abstract
   * @param {import('../InputContext').InputContext} axb
   */
  bindKeys(axb) {
    throw new Error('Unsupported operation.');
    return this;
  }

  /**
   * @abstract
   * @param {import('../InputContext').InputContext} axb
   * @returns {import('../state/InputState').InputState}
   */
  get(axb) {
    throw new Error('Unsupported operation.');
    return null;
  }
}
