/**
 * @typedef InputDeviceEvent
 * @property {EventTarget} target
 * @property {string} device
 * @property {string} code
 * @property {string} event
 * @property {number} [value] The input value of the triggered event (usually this is 1).
 * @property {number} [movement] The change in value for the triggered event.
 * @property {boolean} [control] Whether any control keys are down (false if up).
 * @property {boolean} [shift] Whether any shift keys are down (false if up).
 * @property {boolean} [alt] Whether any alt keys are down (false if up).
 *
 * @callback InputDeviceEventListener
 * @param {InputDeviceEvent} e
 */

/**
 * A class that represents a raw system device that
 * emits input events.
 */
export class InputDevice {
  /** @abstract */
  // eslint-disable-next-line no-unused-vars
  static isAxis(code) {
    return false;
  }

  /** @abstract */
  // eslint-disable-next-line no-unused-vars
  static isButton(code) {
    return false;
  }

  /**
   * @param {string} deviceName
   * @param {EventTarget} eventTarget
   */
  constructor(deviceName, eventTarget) {
    if (!eventTarget) {
      throw new Error(`Missing event target for device ${deviceName}.`);
    }

    this.name = deviceName;
    this.eventTarget = eventTarget;

    /**
     * @private
     * @type {Record<string, Array<InputDeviceEventListener>>}
     */
    this.listeners = {
      input: [],
    };
  }

  /**
   * @param {EventTarget} eventTarget
   */
  setEventTarget(eventTarget) {
    if (!eventTarget) {
      throw new Error(`Missing event target for device ${this.name}.`);
    }
    this.eventTarget = eventTarget;
  }

  destroy() {
    let listeners = this.listeners;
    for (let event in listeners) {
      listeners[event].length = 0;
    }
  }

  /**
   * @param {string} event
   * @param {InputDeviceEventListener} listener
   */
  addEventListener(event, listener) {
    let listeners = this.listeners;
    if (event in listeners) {
      listeners[event].push(listener);
    } else {
      listeners[event] = [listener];
    }
  }

  /**
   * @param {string} event
   * @param {InputDeviceEventListener} listener
   */
  removeEventListener(event, listener) {
    let listeners = this.listeners;
    if (event in listeners) {
      let list = listeners[event];
      let i = list.indexOf(listener);
      if (i >= 0) {
        list.splice(i, 1);
      }
    }
  }

  /**
   * @param {InputDeviceEvent} e
   * @returns {boolean} Whether the input event should be consumed.
   */
  dispatchInputEvent(e) {
    let flag = 0;
    for (let listener of this.listeners.input) {
      flag |= listener(e);
    }
    return Boolean(flag);
  }
}
