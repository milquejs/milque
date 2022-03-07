import { from } from '../keycode/KeyCodes.js';
import { AxisBinding } from './AxisBinding.js';

/** @typedef {import('../keycode/KeyCode.js').KeyCode} KeyCode */

export class AxisButtonBinding extends AxisBinding {
  /**
   * @param {string} name
   * @param {string} device
   * @param {string} negativeCode
   * @param {string} positiveCode
   * @returns {AxisButtonBinding}
   */
  static fromBind(name, device, negativeCode, positiveCode) {
    return new AxisButtonBinding(
      name,
      from(device, negativeCode),
      from(device, positiveCode)
    );
  }

  /**
   * @param {string} name
   * @param {KeyCode} negativeKeyCode
   * @param {KeyCode} positiveKeyCode
   */
  constructor(name, negativeKeyCode, positiveKeyCode) {
    super(name);

    if (negativeKeyCode.device !== positiveKeyCode.device) {
      throw new Error('Cannot create axis-button codes for different devices.');
    }

    /** @protected */
    this.negativeKeyCode = negativeKeyCode;
    /** @protected */
    this.positiveKeyCode = positiveKeyCode;
  }

  /**
   * @param {import('../InputContext.js').InputContext} inputContext
   */
  register(inputContext) {
    let name = this.name;
    let negativeKeyCode = this.negativeKeyCode;
    let positiveKeyCode = this.positiveKeyCode;
    inputContext.bindAxisButtons(
      name,
      negativeKeyCode.device,
      negativeKeyCode.code,
      positiveKeyCode.code
    );
    this.ref = inputContext.getAxis(name);
    return this;
  }
}
