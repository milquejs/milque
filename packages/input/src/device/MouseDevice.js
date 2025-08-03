import { InputDevice } from './InputDevice.js';

/**
 * @typedef {import('./InputDevice.js').InputDeviceEvent} InputDeviceEvent
 */

const DEFAULT_LINE_PIXELS = 10;
const DEFAULT_PAGE_PIXELS = 100;

/**
 * A class that listens to the mouse events from the event target and
 * transforms the events into a valid {@link InputDeviceEvent} for its
 * listeners.
 *
 * - PosX
 * - PosY
 * - WheelX
 * - WheelY
 * - WheelZ
 * - Button0 (left button)
 * - Button1 (middle button)
 * - Button2 (right button)
 * - Button3 (next button)
 * - Button4 (back button)
 */
export class MouseDevice extends InputDevice {
  /** @override */
  static isAxis(keyCode) {
    return (
      keyCode === 'PosX' ||
      keyCode === 'PosY' ||
      keyCode === 'WheelX' ||
      keyCode === 'WheelY' ||
      keyCode === 'WheelZ'
    );
  }

  /** @override */
  static isButton(keyCode) {
    return !this.isAxis(keyCode);
  }

  /**
   * Constructs a listening mouse with no listeners (yet).
   *
   * @param {string} deviceName
   * @param {EventTarget} eventTarget
   * @param {Object} [opts] Any additional options.
   * @param {Boolean} [opts.eventsOnFocus=true] Whether to capture events only when it has focus.
   */
  constructor(deviceName, eventTarget, opts = {}) {
    super(deviceName, eventTarget);

    const { eventsOnFocus = true } = opts;
    this.eventsOnFocus = eventsOnFocus;
    this.canvasTarget = this.getCanvasFromEventTarget(eventTarget);

    /** @private */
    this._downHasFocus = false;

    /**
     * @private
     * @type {InputDeviceEvent}
     */
    this._eventObject = {
      target: eventTarget,
      device: deviceName,
      code: '',
      event: '',
      // Button values
      value: 0,
      control: false,
      shift: false,
      alt: false,
    };
    /**
     * @private
     * @type {InputDeviceEvent}
     */
    this._positionObject = {
      target: eventTarget,
      device: deviceName,
      code: '',
      event: 'move',
      // Pos values
      value: 0,
      movement: 0,
    };
    /**
     * @private
     * @type {InputDeviceEvent}
     */
    this._wheelObject = {
      target: eventTarget,
      device: deviceName,
      code: '',
      event: 'wheel',
      // Wheel values
      movement: 0,
    };

    /** @private */
    this.onMouseDown = this.onMouseDown.bind(this);
    /** @private */
    this.onMouseUp = this.onMouseUp.bind(this);
    /** @private */
    this.onMouseMove = this.onMouseMove.bind(this);
    /** @private */
    this.onContextMenu = this.onContextMenu.bind(this);
    /** @private */
    this.onWheel = this.onWheel.bind(this);

    eventTarget.addEventListener('mousedown', this.onMouseDown);
    eventTarget.addEventListener('contextmenu', this.onContextMenu);
    eventTarget.addEventListener('wheel', this.onWheel);
    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('mouseup', this.onMouseUp);
  }

  /** @override */
  setEventTarget(eventTarget) {
    if (this.eventTarget) this.destroy();
    super.setEventTarget(eventTarget);
    this.canvasTarget = this.getCanvasFromEventTarget(eventTarget);
    eventTarget.addEventListener('mousedown', this.onMouseDown);
    eventTarget.addEventListener('contextmenu', this.onContextMenu);
    eventTarget.addEventListener('wheel', this.onWheel);
    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('mouseup', this.onMouseUp);
  }

  /** @override */
  destroy() {
    let eventTarget = this.eventTarget;
    eventTarget.removeEventListener('mousedown', this.onMouseDown);
    eventTarget.removeEventListener('contextmenu', this.onContextMenu);
    eventTarget.removeEventListener('wheel', this.onWheel);
    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('mouseup', this.onMouseUp);
    super.destroy();
  }

  setPointerLock(force = true) {
    if (force) {
      this.eventTarget.requestPointerLock();
    } else {
      this.eventTarget.exitPointerLock();
    }
  }

  hasPointerLock() {
    return document.pointerLockElement === this.eventTarget;
  }

  /**
   * @private
   * @param {MouseEvent} e
   */
  onMouseDown(e) {
    this._downHasFocus = true;

    let event = this._eventObject;
    // We care more about location (code) than print char (key).
    event.code = 'Button' + e.button;
    event.event = 'pressed';
    event.value = 1;
    event.control = e.ctrlKey;
    event.shift = e.shiftKey;
    event.alt = e.altKey;

    let result = this.dispatchInputEvent(event);
    if (result) {
      // Make sure it has focus first.
      if (document.activeElement === this.eventTarget) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    }
  }

  /**
   * @private
   * @param {MouseEvent} e
   */
  onContextMenu(e) {
    e.preventDefault();
    e.stopPropagation();
    return false;
  }

  /**
   * @private
   * @param {WheelEvent} e
   */
  onWheel(e) {
    let dx, dy, dz;
    switch (e.deltaMode) {
      case WheelEvent.DOM_DELTA_LINE:
        dx = e.deltaX * DEFAULT_LINE_PIXELS;
        dy = e.deltaY * DEFAULT_LINE_PIXELS;
        dz = e.deltaZ * DEFAULT_LINE_PIXELS;
        break;
      case WheelEvent.DOM_DELTA_PAGE:
        dx = e.deltaX * DEFAULT_PAGE_PIXELS;
        dy = e.deltaY * DEFAULT_PAGE_PIXELS;
        dz = e.deltaZ * DEFAULT_PAGE_PIXELS;
        break;
      case WheelEvent.DOM_DELTA_PIXEL:
      default:
        dx = e.deltaX;
        dy = e.deltaY;
        dz = e.deltaZ;
        break;
    }

    let result = 0;
    let event = this._wheelObject;
    event.code = 'WheelX';
    event.movement = dx;
    result |= this.dispatchInputEvent(event);
    event.code = 'WheelY';
    event.movement = dy;
    result |= this.dispatchInputEvent(event);
    event.code = 'WheelZ';
    event.movement = dz;
    result |= this.dispatchInputEvent(event);
    if (result) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
  }

  /**
   * @private
   * @param {MouseEvent} e
   */
  onMouseUp(e) {
    // Make sure mouse down was pressed before this (with focus).
    if (!this._downHasFocus) return;
    this._downHasFocus = false;

    let event = this._eventObject;
    // We care more about location (code) than print char (key).
    event.code = 'Button' + e.button;
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

  /**
   * @private
   * @param {MouseEvent} e
   */
  onMouseMove(e) {
    if (this.eventsOnFocus && document.activeElement !== this.eventTarget)
      return;

    const element = this.canvasTarget;
    const { clientWidth, clientHeight } = element;
    const rect = element.getBoundingClientRect();

    let dx = e.movementX / clientWidth;
    let dy = e.movementY / clientHeight;
    let x = (e.clientX - rect.left) / clientWidth;
    let y = (e.clientY - rect.top) / clientHeight;

    let event = this._positionObject;
    event.code = 'PosX';
    event.value = x;
    event.movement = dx;
    this.dispatchInputEvent(event);
    event.code = 'PosY';
    event.value = y;
    event.movement = dy;
    this.dispatchInputEvent(event);
  }

  /** @private */
  getCanvasFromEventTarget(eventTarget) {
    if (eventTarget instanceof HTMLCanvasElement) {
      return eventTarget;
    } else {
      return (
        eventTarget.canvas ||
        eventTarget.querySelector('canvas') ||
        (eventTarget.shadowRoot &&
          eventTarget.shadowRoot.querySelector('canvas')) ||
        eventTarget
      );
    }
  }
}
