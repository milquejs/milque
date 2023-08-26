import { KeyCode } from '../keycode/KeyCode';
import { InputBinding } from './InputBinding';

/**
 * @typedef {import('../InputContext.js').InputContext} InputContext
 */

export class AxisBinding extends InputBinding {
  /**
   * @param {string} name
   * @param {string} device
   * @param {string} code
   * @param {object} [opts]
   * @returns {AxisBinding}
   */
  static fromBind(name, device, code, opts = undefined) {
    return new AxisBinding(name, KeyCode.parse(`${device}.${code}`), opts);
  }

  /**
   * @param {string} name
   * @param {...string} strings
   * @returns {AxisBinding}
   */
  static fromString(name, ...strings) {
    let keyCodes = strings.map(string => KeyCode.parse(string));
    return new AxisBinding(name, keyCodes);
  }

  /**
   * @param {string} name
   * @param {KeyCode|Array<KeyCode>} keyCodes
   * @param {object} [opts]
   */
  constructor(name, keyCodes, opts = undefined) {
    super(name);

    this.keyCodes = Array.isArray(keyCodes) ? keyCodes : [keyCodes];
    this.opts = opts;

    /** @type {import('../state/AxisState.js').AxisState} */
    this.current = null;
  }

  /**
   * @override
   * @param {InputContext} axb
   */
  bindKeys(axb) {
    let name = this.name;
    let opts = this.opts;
    for (let keyCode of this.keyCodes) {
      axb.bindAxis(name, keyCode.device, keyCode.code, opts);
    }
    this.current = axb.getAxis(name);
    return this;
  }

  /**
   * @override
   * @param {InputContext} axb
   */
  get(axb) {
    let name = this.name;
    if (!axb.hasAxis(name)) {
      this.bindKeys(axb);
    }
    let result = axb.getAxis(name);
    this.current = result;
    return result;
  }
}
