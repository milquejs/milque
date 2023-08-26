/**
 * A class that represents a raw system device that
 * emits input events.
 * 
 * @fires InputDeviceEvent
 */
export class InputDevice extends EventTarget {

  /**
   * @param {string} deviceName
   * @param {EventTarget} eventTarget
   */
  constructor(deviceName, eventTarget) {
    super();

    if (!eventTarget) {
      throw new Error(`Missing event target for device ${deviceName}.`);
    }

    /** @readonly */
    this.name = deviceName;
    /**
     * @protected
     * @readonly
     * @type {EventTarget|null}
     */
    this.eventTarget = eventTarget;
  }

  /**
   * @param {EventTarget} eventTarget
   */
  setEventTarget(eventTarget) {
    if (!eventTarget) {
      throw new Error(`Missing event target for device ${this.name}.`);
    }
    if (this.eventTarget) {
      this.destroy();
    }
    // @ts-ignore
    this.eventTarget = eventTarget;
    return this;
  }

  /**
   * @abstract
   */
  destroy() {
    // @ts-ignore
    this.eventTarget = null;
  }

  /**
   * Should be called regularly to poll non-event-based inputs.
   * @abstract
   * @param {number} now
   */
  poll(now = performance.now()) {}
}

/**
 * @typedef InputDeviceEventInit
 * @property {number} [value] The input value of the triggered event (usually this is 1).
 * @property {number} [movement] The change in value for the triggered event.
 * @property {boolean} [control] Whether any control keys are down (false if up).
 * @property {boolean} [shift] Whether any shift keys are down (false if up).
 * @property {boolean} [alt] Whether any alt keys are down (false if up).
 * @property {boolean} [repeat] Whether this is a repeat press from holding.
 * @property {number} [deviceIndex] The device index (usually just 0 unless multiple gamepads).
 */

export class InputDeviceEvent extends Event {
  /**
   * @param {string} type
   * @param {string} device
   * @param {string} code
   * @param {string} event
   * @param {InputDeviceEventInit} [eventInitDict]
   */
  constructor(type, device, code, event, eventInitDict) {
    super(type, { bubbles: false, cancelable: true, composed: false });

    /** @readonly */
    this.device = device;
    /** @readonly */
    this.code = code;
    /** @readonly */
    this.event = event;

    /**
     * The input value of the triggered event (usually this is 1).
     * @readonly
     * @type {number}
     */
    this.value = Number(eventInitDict?.value || 0);
    /**
     * The change in value for the triggered event.
     * @readonly
     * @type {number}
     */
    this.movement = Number(eventInitDict?.movement || 0);
    /**
     * Whether any control keys are down (false if up).
     * @readonly
     * @type {boolean}
     */
    this.control = Boolean(eventInitDict?.control);
    /**
     * Whether any shift keys are down (false if up).
     * @readonly
     * @type {boolean}
     */
    this.shift = Boolean(eventInitDict?.shift);
    /**
     * Whether any alt keys are down (false if up).
     * @readonly
     * @type {boolean}
     */
    this.alt = Boolean(eventInitDict?.alt);
    /**
     * Whether this is a repeat press from holding.
     * @readonly
     * @type {boolean}
     */
    this.repeat = Boolean(eventInitDict?.repeat);
    /**
     * The device index (usually just 0 unless multiple gamepads).
     * @readonly
     * @type {number}
     */
    this.deviceIndex = Number(eventInitDict?.deviceIndex || 0);
  }

  /**
   * @param {string} code
   * @param {string} event
   * @param {number} [value]
   * @param {number} [movement]
   * @param {boolean} [control]
   * @param {boolean} [shift]
   * @param {boolean} [alt]
   * @param {boolean} [repeat]
   * @param {number} [deviceIndex]
   */
  initInputDeviceEvent(code, event, value = 0, movement = 0, control = false, shift = false, alt = false, repeat = false, deviceIndex = -1) {
    // @ts-ignore
    this.code = code;
    // @ts-ignore
    this.event = event;
    // @ts-ignore
    this.value = value;
    // @ts-ignore
    this.movement = movement;
    // @ts-ignore
    this.control = control;
    // @ts-ignore
    this.shift = shift;
    // @ts-ignore
    this.alt = alt;
    // @ts-ignore
    this.repeat = repeat;
    // @ts-ignore
    this.deviceIndex = deviceIndex;
    return this;
  }
}
