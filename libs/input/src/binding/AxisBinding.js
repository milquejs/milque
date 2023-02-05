import { from } from '../keycode/KeyCodes.js';
import { InputBinding } from './InputBinding.js';
import { stringsToKeyCodes } from '../keycode/KeyCodeHelper.js';

/** @typedef {import('../keycode/KeyCode.js').KeyCode} KeyCode */

export class AxisBinding extends InputBinding {
  /**
   * @param {string} name
   * @param {string} device
   * @param {string} code
   * @param {object} [opts]
   * @returns {AxisBinding}
   */
  static fromBind(name, device, code, opts = undefined) {
    return new AxisBinding(name, from(device, code), opts);
  }

  /**
   * @param {string} name
   * @param {...string} strings
   * @returns {AxisBinding}
   */
  static fromString(name, ...strings) {
    let keyCodes = stringsToKeyCodes(strings);
    return new AxisBinding(name, keyCodes);
  }

  /** @returns {number} */
  get delta() {
    if (!this.ref || this.disabled) {
      return 0;
    }
    return this.ref.delta;
  }

  /**
   * @param {string} name
   * @param {KeyCode|Array<KeyCode>} keyCodes
   * @param {object} [opts]
   */
  constructor(name, keyCodes, opts = undefined) {
    super(name);

    /** @protected */
    this.keyCodes = Array.isArray(keyCodes) ? keyCodes : [keyCodes];
    /** @protected */
    this.opts = opts;
  }

  /**
   * @override
   * @param {import('../InputContext.js').InputContext} inputContext
   */
  bindTo(inputContext) {
    let name = this.name;
    let opts = this.opts;
    for (let keyCode of this.keyCodes) {
      inputContext.bindAxis(name, keyCode.device, keyCode.code, opts);
    }
    this.ref = inputContext.getAxis(name);
    return this;
  }
}
