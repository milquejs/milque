import { KeyCode } from '../keycode/KeyCode';
import { InputBinding } from './InputBinding';

/**
 * @typedef {import('../InputContext.js').InputContext} InputContext
 */

export class ButtonBinding extends InputBinding {
  /**
   * @param {string} name
   * @param {string} device
   * @param {string} code
   * @param {object} [opts]
   * @returns {ButtonBinding}
   */
  static fromBind(name, device, code, opts = undefined) {
    return new ButtonBinding(name, KeyCode.parse(`${device}.${code}`), opts);
  }

  /**
   * @param {string} name
   * @param {...string} strings
   * @returns {ButtonBinding}
   */
  static fromString(name, ...strings) {
    let keyCodes = strings.map(string => KeyCode.parse(string));
    return new ButtonBinding(name, keyCodes);
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

    /** @type {import('../state/ButtonState.js').ButtonState} */
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
      axb.bindButton(name, keyCode.device, keyCode.code, opts);
    }
    this.current = axb.getButton(name);
    return this;
  }

  /**
   * @override
   * @param {InputContext} axb
   */
  get(axb) {
    let name = this.name;
    if (!axb.hasButton(name)) {
      this.bindKeys(axb);
    }
    let result = axb.getButton(name);
    this.current = result;
    return result;
  }
}
