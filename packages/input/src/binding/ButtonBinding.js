import { from } from '../keycode/KeyCodes.js';
import { InputBinding } from './InputBinding.js';
import { stringsToKeyCodes } from '../keycode/KeyCodeHelper.js';

/** @typedef {import('../keycode/KeyCode.js').KeyCode} KeyCode */

export class ButtonBinding extends InputBinding {
  /**
   * @param {string} name
   * @param {string} device
   * @param {string} code
   * @param {object} [opts]
   * @returns {ButtonBinding}
   */
  static fromBind(name, device, code, opts = undefined) {
    return new ButtonBinding(name, from(device, code), opts);
  }

  /**
   * @param {string} name
   * @param {...string} strings
   * @returns {ButtonBinding}
   */
  static fromString(name, ...strings) {
    let keyCodes = stringsToKeyCodes(strings);
    return new ButtonBinding(name, keyCodes);
  }

  /** @returns {boolean} */
  get pressed() {
    if (!this.ref || this.disabled) {
      return false;
    }
    return this.ref.pressed;
  }

  /** @returns {boolean} */
  get repeated() {
    if (!this.ref || this.disabled) {
      return false;
    }
    return this.ref.repeated;
  }

  /** @returns {boolean} */
  get released() {
    if (!this.ref || this.disabled) {
      return false;
    }
    return this.ref.released;
  }

  /** @returns {boolean} */
  get down() {
    if (!this.ref || this.disabled) {
      return false;
    }
    return this.ref.down;
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
  register(inputContext) {
    let name = this.name;
    let opts = this.opts;
    for (let keyCode of this.keyCodes) {
      inputContext.bindButton(name, keyCode.device, keyCode.code, opts);
    }
    this.ref = inputContext.getButton(name);
    return this;
  }
}
