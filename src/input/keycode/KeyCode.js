export class KeyCode {

  /**
   * Parse a string format to KeyCode.
   * 
   * ex. `Keyboard.KeyA`, `Mouse.PosX`, `Gamepad.Button4`
   * 
   * @param {string} text
   * @param {object} [opts]
   * @param {boolean} [opts.strict]
   * @param {boolean|'range'|'state'} [opts.type]
   * @returns {KeyCode}
   */
  static parse(text, opts) {
    // NOTE: Implementation is overriden by export due to circular-dependency.
    throw new Error('Not yet implemented.');
  }

  /**
   * @param {any} obj
   */
  static isKeyCode(obj) {
    return obj && 'device' in obj && 'code' in obj && 'axis' in obj;
  }

  /**
   * @param {string} device
   * @param {string} code
   * @param {boolean|'range'|'state'} [type]
   */
  constructor(device, code, type = false) {
    /** @readonly */
    this.device = device;
    /** @readonly */
    this.code = code;
    /**
     * @readonly
     * @type {'range'|'state'}
     */
    this.type = type === true ? 'range' : type === false ? 'state' : type;
  }

  toString() {
    return `${this.device}.${this.code}`;
  }
}
