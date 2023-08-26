import { InputDevice, InputDeviceEvent } from './InputDevice.js';

/**
 * A class that listens to the keyboard events from the event target and
 * transforms the events into a valid {@link InputEvent} for the added
 * listeners.
 *
 * - This device uses the `event.code` standard to reference each key.
 * - Use this to help you determine the key code: https://keycode.info/
 */
export class KeyboardDevice extends InputDevice {

  /**
   * Constructs a keyboard.
   *
   * @param {string} deviceName
   * @param {EventTarget} eventTarget
   * @param {object} [opts] Any additional options.
   * @param {boolean} [opts.ignoreRepeat] Whether to accept repeated key events.
   */
  constructor(deviceName, eventTarget, opts = {}) {
    super(deviceName, eventTarget);

    const { ignoreRepeat = true } = opts;

    /** @readonly */
    this.ignoreRepeat = ignoreRepeat;

    /** @private */
    this.onKeyDown = this.onKeyDown.bind(this);
    /** @private */
    this.onKeyUp = this.onKeyUp.bind(this);

    /** @private */
    this.keyEvent = new InputDeviceEvent('input', this.name, '', 'pressed');
    
    if (this.eventTarget) {
      // @ts-ignore
      this.eventTarget.addEventListener('keydown', this.onKeyDown);
      // @ts-ignore
      this.eventTarget.addEventListener('keyup', this.onKeyUp);
    }
  }

  /**
   * @override
   * @param {EventTarget} eventTarget
   */
  setEventTarget(eventTarget) {
    super.setEventTarget(eventTarget);
    if (this.eventTarget) {
      // @ts-ignore
      this.eventTarget.addEventListener('keydown', this.onKeyDown);
      // @ts-ignore
      this.eventTarget.addEventListener('keyup', this.onKeyUp);
    }
    return this;
  }

  /** @override */
  destroy() {
    if (this.eventTarget) {
      // @ts-ignore
      this.eventTarget.removeEventListener('keydown', this.onKeyDown);
      // @ts-ignore
      this.eventTarget.removeEventListener('keyup', this.onKeyUp);
    }
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

    // NOTE: We care more about location (code) than print char (key).
    let event = this.keyEvent;
    event.initInputDeviceEvent(e.code, 'pressed', 1, 0, e.ctrlKey, e.shiftKey, e.altKey, e.repeat);
    const result = this.dispatchEvent(event);
    if (!result) {
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
    // NOTE: We care more about location (code) than print char (key).
    let event = this.keyEvent;
    event.initInputDeviceEvent(e.code, 'released', 1, 0, e.ctrlKey, e.shiftKey, e.altKey);
    const result = this.dispatchEvent(event);
    if (!result) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
  }
}
