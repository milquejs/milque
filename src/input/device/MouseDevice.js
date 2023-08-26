import { InputDevice, InputDeviceEvent } from './InputDevice.js';

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

  /**
   * Constructs a mouse.
   *
   * @param {string} deviceName
   * @param {EventTarget} eventTarget
   * @param {object} [opts] Any additional options.
   * @param {EventTarget} [opts.canvasTarget] The event target for `pointerlock` and mouse position offset.
   * @param {boolean} [opts.eventsOnFocus] Whether to capture events only when it has focus.
   */
  constructor(deviceName, eventTarget, opts = {}) {
    super(deviceName, eventTarget);

    const { eventsOnFocus = true, canvasTarget = getCanvasFromEventTarget(this.eventTarget) } = opts;

    /** @readonly */
    this.eventsOnFocus = eventsOnFocus;

    /**
     * @protected
     * @readonly
     */
    this.canvasTarget = /** @type {HTMLCanvasElement} */ (canvasTarget || eventTarget);

    /** @private */
    this._downHasFocus = false;

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

    /** @private */
    this.clickEvent = new InputDeviceEvent('input', this.name, '', 'pressed');
    /** @private */
    this.moveEvent = new InputDeviceEvent('input', this.name, '', 'moved');
    /** @private */
    this.wheelEvent = new InputDeviceEvent('input', this.name, '', 'wheel');

    if (this.eventTarget) {
      // @ts-ignore
      this.eventTarget.addEventListener('mousedown', this.onMouseDown);
      // @ts-ignore
      this.eventTarget.addEventListener('contextmenu', this.onContextMenu);
      // @ts-ignore
      this.eventTarget.addEventListener('wheel', this.onWheel);
      document.addEventListener('mousemove', this.onMouseMove);
      document.addEventListener('mouseup', this.onMouseUp);
    }
  }

  /**
   * @override
   * @param {EventTarget} eventTarget
   */
  setEventTarget(eventTarget) {
    super.setEventTarget(eventTarget);
    // @ts-ignore
    this.canvasTarget = /** @type {HTMLCanvasElement} */ (getCanvasFromEventTarget(eventTarget) || eventTarget);
    if (this.eventTarget) {
      // @ts-ignore
      this.eventTarget.addEventListener('mousedown', this.onMouseDown);
      // @ts-ignore
      this.eventTarget.addEventListener('contextmenu', this.onContextMenu);
      // @ts-ignore
      this.eventTarget.addEventListener('wheel', this.onWheel);
      document.addEventListener('mousemove', this.onMouseMove);
      document.addEventListener('mouseup', this.onMouseUp);
    }
    return this;
  }

  /** @override */
  destroy() {
    if (this.eventTarget) {
      // @ts-ignore
      this.eventTarget.removeEventListener('mousedown', this.onMouseDown);
      // @ts-ignore
      this.eventTarget.removeEventListener('contextmenu', this.onContextMenu);
      // @ts-ignore
      this.eventTarget.removeEventListener('wheel', this.onWheel);
      document.removeEventListener('mousemove', this.onMouseMove);
      document.removeEventListener('mouseup', this.onMouseUp);
    }
    super.destroy();
  }

  setPointerLock(force = true) {
    const target = /** @type {HTMLCanvasElement} */ (this.canvasTarget);
    if (force) {
      target.requestPointerLock();
    } else {
      // NOTE: Exit is done on the document.
      document.exitPointerLock();
    }
  }

  hasPointerLock() {
    const target = /** @type {HTMLCanvasElement} */ (this.canvasTarget);
    return document.pointerLockElement === target;
  }

  /**
   * @private
   * @param {MouseEvent} e
   */
  onMouseDown(e) {
    this._downHasFocus = true;

    // NOTE: We care more about location (code) than print char (key).
    let event = this.clickEvent;
    event.initInputDeviceEvent(`Button${e.button}`, 'pressed', 1, 0, e.ctrlKey, e.shiftKey, e.altKey);
    const result = this.dispatchEvent(event);
    if (!result) {
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

    let result = true;

    // NOTE: We care more about location (code) than print char (key).
    let event = this.wheelEvent;
    event.initInputDeviceEvent('WheelX', 'wheel', 0, dx);
    result &&= this.dispatchEvent(event);

    event.initInputDeviceEvent('WheelY', 'wheel', 0, dy);
    result &&= this.dispatchEvent(event);

    event.initInputDeviceEvent('WheelZ', 'wheel', 0, dz);
    result &&= this.dispatchEvent(event);
    
    if (!result) {
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

    // NOTE: We care more about location (code) than print char (key).
    let event = this.clickEvent;
    event.initInputDeviceEvent(`Button${e.button}`, 'released', 1, 0, e.ctrlKey, e.shiftKey, e.altKey);
    const result = this.dispatchEvent(event);
    if (!result) {
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
    if (this.eventsOnFocus && document.activeElement !== this.eventTarget) {
      return;
    }

    const element = this.canvasTarget;
    const { clientWidth, clientHeight } = element;
    const rect = element.getBoundingClientRect();

    let dx = e.movementX / clientWidth;
    let dy = e.movementY / clientHeight;
    let x = (e.clientX - rect.left) / clientWidth;
    let y = (e.clientY - rect.top) / clientHeight;

    let result = true;

    let event = this.moveEvent;
    event.initInputDeviceEvent('PosX', 'moved', x, dx);
    result &&= this.dispatchEvent(event);

    event.initInputDeviceEvent('PosY', 'moved', y, dy);
    result &&= this.dispatchEvent(event);
    
    if (!result) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
  }
}

/**
 * @param {EventTarget|null} eventTarget
 * @returns {HTMLCanvasElement|null}
 */
function getCanvasFromEventTarget(eventTarget) {
  if (!eventTarget) {
    return null;
  } else if (eventTarget instanceof HTMLCanvasElement) {
    return eventTarget;
  } else if ('canvas' in eventTarget) {
    return /** @type {HTMLCanvasElement} */ (eventTarget.canvas);
  } else if ('querySelector' in eventTarget) {
    return /** @type {ParentNode} */ (eventTarget).querySelector('canvas');
  } else if ('shadowRoot' in eventTarget) {
    return /** @type {HTMLCanvasElement} */ (/** @type {Element} */ (eventTarget).shadowRoot?.querySelector('canvas'));
  } else {
    return null;
  }
}
