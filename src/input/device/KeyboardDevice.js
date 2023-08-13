import { InputDevice } from './InputDevice.js';

/** @typedef {import('./InputDevice.js').InputDeviceEvent} InputDeviceEvent */

/**
 * A class that listens to the keyboard events from the event target and
 * transforms the events into a valid {@link InputEvent} for the added
 * listeners.
 *
 * - This device uses the `event.code` standard to reference each key.
 * - Use this to help you determine the key code: https://keycode.info/
 */
export class KeyboardDevice extends InputDevice {
  /** @override */
  // eslint-disable-next-line no-unused-vars
  static isAxis(keyCode) {
    return false;
  }

  /** @override */
  // eslint-disable-next-line no-unused-vars
  static isButton(keyCode) {
    return true;
  }

  /**
   * Constructs a listening keyboard with no listeners (yet).
   *
   * @param {string} deviceName
   * @param {EventTarget} eventTarget
   * @param {object} [opts] Any additional options.
   * @param {boolean} [opts.ignoreRepeat] Whether to
   * accept repeated key events.
   */
  constructor(deviceName, eventTarget, opts = {}) {
    super(deviceName, eventTarget);

    const { ignoreRepeat = true } = opts;
    this.ignoreRepeat = ignoreRepeat;

    /**
     * @private
     * @type {InputDeviceEvent}
     */
    this._eventObject = {
      target: eventTarget,
      device: deviceName,
      code: '',
      event: '',
      // Key values
      value: 0,
      control: false,
      shift: false,
      alt: false,
    };

    /** @private */
    this.onKeyDown = this.onKeyDown.bind(this);
    /** @private */
    this.onKeyUp = this.onKeyUp.bind(this);

    eventTarget.addEventListener('keydown', this.onKeyDown);
    eventTarget.addEventListener('keyup', this.onKeyUp);
  }

  /** @override */
  setEventTarget(eventTarget) {
    if (this.eventTarget) this.destroy();
    super.setEventTarget(eventTarget);
    eventTarget.addEventListener('keydown', this.onKeyDown);
    eventTarget.addEventListener('keyup', this.onKeyUp);
  }

  /** @override */
  destroy() {
    let eventTarget = this.eventTarget;
    eventTarget.removeEventListener('keydown', this.onKeyDown);
    eventTarget.removeEventListener('keyup', this.onKeyUp);
    super.destroy();
  }

  /**
   * @private
   * @param {KeyboardEvent} e
   */
  onKeyDown(e) {
    if (e.repeat && this.ignoreRepeat) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }

    let event = this._eventObject;
    // We care more about location (code) than print char (key).
    event.code = e.code;
    event.event = 'pressed';
    event.value = 1;
    event.control = e.ctrlKey;
    event.shift = e.shiftKey;
    event.alt = e.altKey;

    let result = this.dispatchInputEvent(event);
    if (result) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
  }

  /**
   * @private
   * @param {KeyboardEvent} e
   */
  onKeyUp(e) {
    /** @type {InputDeviceEvent} */
    let event = this._eventObject;
    // We care more about location (code) than print char (key).
    event.code = e.code;
    event.event = 'released';
    event.value = 1;
    event.control = e.ctrlKey;
    event.shift = e.shiftKey;
    event.alt = e.altKey;

    let result = this.dispatchInputEvent(event);
    if (result) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
  }
}
