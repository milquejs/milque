/**
 * An enum for input types.
 * 
 * @readonly
 * @enum {Number}
 */
const InputType = {
  NULL: 0,
  KEY: 1,
  POS: 2,
  WHEEL: 3
};
/**
 * An enum for input events.
 * 
 * @readonly
 * @enum {Number}
 */

const InputEventCode = {
  NULL: 0,
  DOWN: 1,
  UP: 2,
  MOVE: 3,

  parse(string) {
    if (typeof string === 'string') {
      switch (string.toLowerCase()) {
        case 'down':
          return InputEventCode.DOWN;

        case 'up':
          return InputEventCode.UP;

        case 'move':
          return InputEventCode.MOVE;

        default:
          return InputEventCode.NULL;
      }
    } else {
      return InputEventCode.NULL;
    }
  }

};
const WILDCARD_KEY_MATCHER = '*';
/**
 * @typedef InputEvent
 * @property {EventTarget} target
 * @property {String} deviceName
 * @property {String} keyCode
 * @property {InputEventCode} event
 * @property {InputType} type
 * @property {Number} [value] If type is `key`, it is defined to be the input
 * value of the triggered event (usually this is 1). Otherwise, it is undefined.
 * @property {Boolean} [control] If type is `key`, it is defined to be true if
 * any control key is down (false if up). Otherwise, it is undefined.
 * @property {Boolean} [shift] If type is `key`, it is defined to be true if
 * any shift key is down (false if up). Otherwise, it is undefined.
 * @property {Boolean} [alt] If type is `key`, it is defined to be true if any
 * alt key is down (false if up). Otherwise, it is undefined.
 * @property {Number} [x] If type is `pos`, it is defined to be the x value
 * of the position event. Otherwise, it is undefined.
 * @property {Number} [y] If type is `pos`, it is defined to be the y value
 * of the position event. Otherwise, it is undefined.
 * @property {Number} [dx] If type is `pos` or `wheel`, it is defined to be
 * the change in the x value from the previous to the current position.
 * Otherwise, it is undefined.
 * @property {Number} [dy] If type is `pos` or `wheel`, it is defined to be
 * the change in the y value from the previous to the current position.
 * Otherwise, it is undefined.
 * @property {Number} [dz] If type is `wheel`, it is defined to be the change
 * in the z value from the previous to the current position. Otherwise, it
 * is undefined.
 * 
 * @callback InputDeviceListener
 * @param {InputEvent} e
 * @returns {Boolean} Whether to consume the input after all other
 * listeners had a chance to handle the event.
 */

class InputDevice {
  constructor(deviceName, eventTarget) {
    this.deviceName = deviceName;
    this.eventTarget = eventTarget;
    /** @private */

    this.listeners = {};
  }

  destroy() {
    /** @private */
    this.listeners = {};
  }
  /**
   * @param {String} keyMatcher
   * @param {InputDeviceListener} listener
   */


  addInputListener(keyMatcher, listener) {
    let inputListeners = this.listeners[keyMatcher];

    if (!inputListeners) {
      inputListeners = [listener];
      this.listeners[keyMatcher] = inputListeners;
    } else {
      inputListeners.push(listener);
    }
  }
  /**
   * @param {String} keyMatcher
   * @param {InputDeviceListener} listener
   */


  removeInputListener(keyMatcher, listener) {
    let inputListeners = this.listeners[keyMatcher];

    if (inputListeners) {
      inputListeners.indexOf(listener);
      inputListeners.splice(listener, 1);
    }
  }
  /**
   * @param {InputEvent} e
   * @returns {Boolean} Whether the input event should be consumed.
   */


  dispatchInput(e) {
    const {
      keyCode
    } = e;
    const listeners = this.listeners[keyCode];
    let flag = false;

    if (listeners) {
      // KeyCode listeners
      for (let listener of listeners) {
        flag |= listener(e);
      }

      return flag;
    } // Wildcard listeners


    for (let listener of this.listeners[WILDCARD_KEY_MATCHER]) {
      flag |= listener(e);
    }

    return flag;
  }

}

/**
 * @typedef AdapterInput
 * @property {Function} update
 * @property {Function} poll
 * @property {Function} reset
 * 
 * @typedef Adapter
 * @property {AdapterInput} target
 * @property {Number} adapterId
 * @property {String} deviceName
 * @property {String} keyCode
 * @property {Number} scale
 * @property {Number} eventCode
 */

const WILDCARD_DEVICE_MATCHER = '*';
class AdapterManager {
  /**
   * Creates a new adapter for the given values.
   * 
   * @param {AdapterInput} target The target callback to update the value.
   * @param {Number} adapterId The adapter id (unique within the target).
   * @param {String} deviceName The name of the device to listen to.
   * @param {String} keyCode The key code to listen to.
   * @param {Number} scale The input value multiplier.
   * @param {Number} eventCode The event code to listen for.
   * @returns {Adapter} The new adapter.
   */
  static createAdapter(target, adapterId, deviceName, keyCode, scale, eventCode) {
    return {
      target,
      adapterId,
      deviceName,
      keyCode,
      scale,
      eventCode
    };
  }

  constructor() {
    /** @private */
    this.adapters = {
      [WILDCARD_DEVICE_MATCHER]: createKeyCodeMap()
    };
  }
  /**
   * @param {Array<Adapter>} adapters 
   */


  add(adapters) {
    for (let adapter of adapters) {
      const {
        deviceName,
        keyCode
      } = adapter;
      let adapterMap;

      if (!(deviceName in this.adapters)) {
        adapterMap = createKeyCodeMap();
        this.adapters[deviceName] = adapterMap;
      } else {
        adapterMap = this.adapters[deviceName];
      }

      if (keyCode in adapterMap) {
        adapterMap[keyCode].push(adapter);
      } else {
        adapterMap[keyCode] = [adapter];
      }
    }
  }
  /**
   * @param {Array<Adapter>} adapters
   */


  delete(adapters) {
    for (let adapter of adapters) {
      const {
        deviceName,
        keyCode
      } = adapter;

      if (deviceName in this.adapters) {
        let adapterMap = this.adapters[deviceName];

        if (keyCode in adapterMap) {
          let list = adapterMap[keyCode];
          let index = list.indexOf(adapter);

          if (index >= 0) {
            list.splice(index, 1);
          }
        }
      }
    }
  }

  clear() {
    for (let deviceName in this.adapters) {
      this.adapters[deviceName] = createKeyCodeMap();
    }
  }

  poll(deviceName, keyCode, input) {
    const adapters = this.findAdapters(deviceName, keyCode);

    for (let adapter of adapters) {
      const eventCode = adapter.eventCode;

      if (eventCode === InputEventCode.NULL) {
        const {
          target,
          scale
        } = adapter;
        const nextValue = input.value * scale;
        target.poll(nextValue, adapter);
      } else {
        const {
          target,
          scale
        } = adapter;
        const nextValue = input.getEvent(eventCode) * scale;
        target.poll(nextValue, adapter);
      }
    }

    return adapters.length > 0;
  }

  update(deviceName, keyCode, input) {
    let flag = false;

    for (let adapter of this.findAdapters(deviceName, keyCode)) {
      const eventCode = adapter.eventCode;

      if (eventCode !== InputEventCode.NULL) {
        const {
          target,
          scale
        } = adapter;
        const nextValue = input.getEvent(eventCode) * scale;
        target.update(nextValue, adapter);
        flag = true;
      }
    }

    return flag;
  }

  reset(deviceName, keyCode, input) {
    let flag = false;

    for (let adapter of this.findAdapters(deviceName, keyCode)) {
      adapter.target.reset();
      flag = true;
    }

    return flag;
  }
  /**
   * Find all adapters for the given device and key code.
   * 
   * @param {String} deviceName The name of the target device.
   * @param {String} keyCode The target key code.
   * @returns {Array<Adapter>} The associated adapters for the device and key code.
   */


  findAdapters(deviceName, keyCode) {
    let result = [];

    if (deviceName in this.adapters) {
      let adapterMap = this.adapters[deviceName];
      if (keyCode in adapterMap) result.push(...adapterMap[keyCode]);
      result.push(...adapterMap[WILDCARD_KEY_MATCHER]);
    }

    let wildMap = this.adapters[WILDCARD_DEVICE_MATCHER];
    if (keyCode in wildMap) result.push(...wildMap[keyCode]);
    result.push(...wildMap[WILDCARD_KEY_MATCHER]);
    return result;
  }

}

function createKeyCodeMap() {
  return {
    [WILDCARD_KEY_MATCHER]: []
  };
}

class Input {
  constructor() {
    /** The current state of the input. */
    this.value = 0;
  }

  update(value) {
    this.value = value;
  }

  poll() {
    this.value = 0;
  }
  /**
   * @param {import('../device/InputDevice.js').InputEventCode} eventCode
   * @returns {Number} The event state.
   */


  getEvent(eventCode) {
    return 0;
  }

  getState() {
    return this.value;
  }

}

const KEY_STRING_DEVICE_SEPARATOR = ':';
class Synthetic extends Input {
  constructor(adapterOptions) {
    super();
    this.update = this.update.bind(this);

    if (!Array.isArray(adapterOptions)) {
      adapterOptions = [adapterOptions];
    }

    let adapterList = [];
    let adapterId = 0;

    for (let adapterOption of adapterOptions) {
      if (typeof adapterOption === 'string') {
        adapterOption = {
          key: adapterOption
        };
      }

      const {
        key,
        scale = 1,
        event = 'null'
      } = adapterOption;
      const {
        deviceName,
        keyCode
      } = parseKeyString(key);
      const eventCode = InputEventCode.parse(event);
      const scaleValue = Number(scale);
      let adapter = AdapterManager.createAdapter(this, adapterId, deviceName, keyCode, scaleValue, eventCode);
      adapterList.push(adapter);
      ++adapterId;
    }
    /** @private */


    this.adapters = adapterList;
    /** @private */

    this.values = new Array(adapterList.length).fill(0);
    /** @private */

    this.next = {
      values: new Array(adapterList.length).fill(0),
      value: 0
    };
  }
  /** @override */


  poll(value, adapter) {
    const adapterId = adapter.adapterId;
    let prevValue = this.values[adapterId];
    this.values[adapterId] = value;
    this.value = this.value - prevValue + value;
    this.next.values[adapterId] = 0;
    this.next.value += value - prevValue;
  }
  /** @override */


  update(value, adapter) {
    const adapterId = adapter.adapterId;
    let prevValue = this.next.values[adapterId];
    this.next.values[adapterId] = value;
    this.next.value += value - prevValue;
  }

  reset() {
    this.values.fill(0);
    this.value = 0;
    this.next.values.fill(0);
    this.next.value = 0;
  }

}
function parseKeyString(keyString) {
  let i = keyString.indexOf(KEY_STRING_DEVICE_SEPARATOR);

  if (i >= 0) {
    return {
      deviceName: keyString.substring(0, i),
      keyCode: keyString.substring(i + 1)
    };
  } else {
    throw new Error(`Invalid key string - missing device separator '${KEY_STRING_DEVICE_SEPARATOR}'.`);
  }
}
function stringifyDeviceKeyCodePair(deviceName, keyCode) {
  return `${deviceName}${KEY_STRING_DEVICE_SEPARATOR}${keyCode}`;
}

/**
 * Available Key Codes:
 * - This uses the `event.code` standard to reference each key.
 * - Use this to help you determine the code: https://keycode.info/
 */

/**
 * A class that listens to the keyboard events from the event target and
 * transforms the events into a valid {@link InputEvent} for the added
 * listeners.
 */

class Keyboard extends InputDevice {
  /**
   * Constructs a listening keyboard with no listeners (yet).
   * 
   * @param {EventTarget} eventTarget 
   * @param {Object} [opts] Any additional options.
   * @param {Boolean} [opts.repeat=false] Whether to accept repeated key
   * events.
   */
  constructor(eventTarget, opts = {}) {
    super('Keyboard', eventTarget);
    const {
      repeat = false
    } = opts;
    this.repeat = repeat;
    /** @private */

    this._eventObject = {
      target: eventTarget,
      deviceName: this.deviceName,
      keyCode: '',
      event: InputEventCode.NULL,
      type: InputType.KEY,
      // Key values
      value: 0,
      control: false,
      shift: false,
      alt: false
    };
    /** @private */

    this.onKeyDown = this.onKeyDown.bind(this);
    /** @private */

    this.onKeyUp = this.onKeyUp.bind(this);
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
    if (e.repeat) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }

    let event = this._eventObject; // We care more about location (code) than print char (key).

    event.keyCode = e.code;
    event.event = InputEventCode.DOWN;
    event.value = 1;
    event.control = e.ctrlKey;
    event.shift = e.shiftKey;
    event.alt = e.altKey;
    let result = this.dispatchInput(event);

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
    let event = this._eventObject; // We care more about location (code) than print char (key).

    event.keyCode = e.code;
    event.event = InputEventCode.UP;
    event.value = 1;
    event.control = e.ctrlKey;
    event.shift = e.shiftKey;
    event.alt = e.altKey;
    let result = this.dispatchInput(event);

    if (result) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
  }

}

/**
 * Available Key Codes:
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

const DEFAULT_LINE_PIXELS = 10;
const DEFAULT_PAGE_PIXELS = 100;
/**
 * A class that listens to the keyboard events from the event target and
 * transforms the events into a valid {@link InputEvent} for the added
 * listeners.
 */

class Mouse extends InputDevice {
  /**
   * Constructs a listening mouse with no listeners (yet).
   * 
   * @param {EventTarget} eventTarget
   * @param {Object} [opts] Any additional options.
   * @param {Boolean} [opts.eventsOnFocus=true] Whether to capture events only when it has focus.
   */
  constructor(eventTarget, opts = {
    eventsOnFocus: true
  }) {
    super('Mouse', eventTarget);
    this.canvasTarget = eventTarget instanceof HTMLCanvasElement && eventTarget || eventTarget.canvas || eventTarget.querySelector('canvas') || eventTarget.shadowRoot && eventTarget.shadowRoot.querySelector('canvas') || eventTarget;
    this.eventsOnFocus = opts.eventsOnFocus;
    this._downHasFocus = false;
    /** @private */

    this._eventObject = {
      target: eventTarget,
      deviceName: this.deviceName,
      keyCode: '',
      event: InputEventCode.NULL,
      type: InputType.KEY,
      // Key values
      value: 0,
      control: false,
      shift: false,
      alt: false
    };
    /** @private */

    this._positionObject = {
      target: eventTarget,
      deviceName: this.deviceName,
      keyCode: 'Position',
      event: InputEventCode.MOVE,
      type: InputType.POS,
      // Pos values
      x: 0,
      y: 0,
      dx: 0,
      dy: 0
    };
    /** @private */

    this._wheelObject = {
      target: eventTarget,
      deviceName: this.deviceName,
      keyCode: 'Wheel',
      event: InputEventCode.MOVE,
      type: InputType.WHEEL,
      // Wheel values
      dx: 0,
      dy: 0,
      dz: 0
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
    eventTarget.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('mouseup', this.onMouseUp);
  }
  /** @override */


  destroy() {
    let eventTarget = this.eventTarget;
    eventTarget.removeEventListener('mousedown', this.onMouseDown);
    eventTarget.removeEventListener('contextmenu', this.onContextMenu);
    eventTarget.removeEventListener('wheel', this.onWheel);
    eventTarget.removeEventListener('mousemove', this.onMouseMove);
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
    let event = this._eventObject; // We care more about location (code) than print char (key).

    event.keyCode = 'Button' + e.button;
    event.event = InputEventCode.DOWN;
    event.value = 1;
    event.control = e.ctrlKey;
    event.shift = e.shiftKey;
    event.alt = e.altKey;
    let result = this.dispatchInput(event);

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
    let event = this._wheelObject;

    switch (e.deltaMode) {
      case WheelEvent.DOM_DELTA_LINE:
        event.dx = e.deltaX * DEFAULT_LINE_PIXELS;
        event.dy = e.deltaY * DEFAULT_LINE_PIXELS;
        event.dz = e.deltaZ * DEFAULT_LINE_PIXELS;
        break;

      case WheelEvent.DOM_DELTA_PAGE:
        event.dx = e.deltaX * DEFAULT_PAGE_PIXELS;
        event.dy = e.deltaY * DEFAULT_PAGE_PIXELS;
        event.dz = e.deltaZ * DEFAULT_PAGE_PIXELS;
        break;

      case WheelEvent.DOM_DELTA_PIXEL:
      default:
        event.dx = e.deltaX;
        event.dy = e.deltaY;
        event.dz = e.deltaZ;
        break;
    }

    let result = this.dispatchInput(event);

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
    let event = this._eventObject; // We care more about location (code) than print char (key).

    event.keyCode = 'Button' + e.button;
    event.event = InputEventCode.UP;
    event.value = 1;
    event.control = e.ctrlKey;
    event.shift = e.shiftKey;
    event.alt = e.altKey;
    let result = this.dispatchInput(event);

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
    if (this.eventsOnFocus && document.activeElement !== this.eventTarget) return;
    const element = this.canvasTarget;
    const {
      clientWidth,
      clientHeight
    } = element;
    const rect = element.getBoundingClientRect();
    let dx = e.movementX / clientWidth;
    let dy = e.movementY / clientHeight;
    let x = (e.clientX - rect.left) / clientWidth;
    let y = (e.clientY - rect.top) / clientHeight;
    let event = this._positionObject;
    event.x = x;
    event.y = y;
    event.dx = dx;
    event.dy = dy;
    this.dispatchInput(event);
  }

}

class Axis extends Input {
  constructor() {
    super();
    this.delta = 0;
    /** @private */

    this.next = {
      delta: 0
    };
  }
  /** @override */


  update(value, delta) {
    this.value = value;
    this.next.delta += delta;
  }
  /** @override */


  poll() {
    this.delta = this.next.delta;
    this.next.delta = 0;
  }
  /** @override */


  getEvent(eventCode) {
    switch (eventCode) {
      case InputEventCode.MOVE:
        return this.delta;

      default:
        return super.getEvent(eventCode);
    }
  }

}

class Button extends Input {
  constructor() {
    super();
    /** Whether the button is just pressed. Is updated on poll(). */

    this.down = false;
    /** Whether the button is just released. Is updated on poll(). */

    this.up = false;
    /** @private */

    this.next = {
      down: false,
      up: false
    };
  }
  /** @override */


  update(value) {
    if (value) {
      this.next.down = true;
    } else {
      this.next.up = true;
    }
  }
  /** @override */


  poll() {
    const {
      up: nextUp,
      down: nextDown
    } = this.next;

    if (this.value) {
      if (this.up && !nextUp) {
        this.value = 0;
      }
    } else if (nextDown) {
      this.value = 1;
    }

    this.down = nextDown;
    this.up = nextUp;
    this.next.down = false;
    this.next.up = false;
  }
  /** @override */


  getEvent(eventCode) {
    switch (eventCode) {
      case InputEventCode.DOWN:
        return this.down & 1;

      case InputEventCode.UP:
        return this.up & 1;

      default:
        return super.getEvent(eventCode);
    }
  }

}

/**
 * @readonly
 * @enum {Number}
 */

const InputSourceStage = {
  NULL: 0,
  UPDATE: 1,
  POLL: 2
};
/**
 * Whether the given key code for device is an axis input.
 * 
 * @param {String} deviceName 
 * @param {String} keyCode 
 */

function isInputAxis(deviceName, keyCode) {
  return deviceName === 'Mouse' && (keyCode === 'PosX' || keyCode === 'PosY' || keyCode === 'WheelX' || keyCode === 'WheelY' || keyCode === 'WheelZ');
}
/** This determines whether an element has an associated input source. */

const INPUT_SOURCE_REF_KEY = Symbol('inputSource');
/**
 * @typedef InputSourceInputEvent
 * @property {InputSourceStage} stage
 * @property {String} deviceName
 * @property {String} keyCode
 * @property {Axis|Button} input
 * 
 * @typedef InputSourcePollEvent
 * 
 * @callback InputSourceEventListener
 * @param {InputSourceInputEvent|InputSourcePollEvent} e
 */

/**
 * A class to model the current input state with buttons and axes.
 */

class InputSource {
  static for(eventTarget) {
    if (Object.prototype.hasOwnProperty.call(eventTarget, INPUT_SOURCE_REF_KEY)) {
      return eventTarget[INPUT_SOURCE_REF_KEY];
    } else {
      let result = new InputSource([new Keyboard(eventTarget), new Mouse(eventTarget)]);
      Object.defineProperty(eventTarget, INPUT_SOURCE_REF_KEY, {
        value: result
      });
      return result;
    }
  }

  constructor(deviceList) {
    /** @private */
    this.onInputEvent = this.onInputEvent.bind(this);
    let deviceMap = {};
    let inputMap = {};

    for (let device of deviceList) {
      const deviceName = device.deviceName;
      deviceMap[deviceName] = device;
      inputMap[deviceName] = {};
      device.addInputListener(WILDCARD_KEY_MATCHER, this.onInputEvent);
    }

    this.devices = deviceMap;
    /** @private */

    this.inputs = inputMap;
    /** @private */

    this.listeners = {
      poll: [],
      update: []
    };
  }

  destroy() {
    this.clear();

    for (let deviceName in this.devices) {
      let device = this.devices[deviceName];
      device.removeInputListener(WILDCARD_KEY_MATCHER, this.onInputEvent);
      device.destroy();
    }
  }
  /**
   * Add listener to listen for event, in order by most
   * recently added. In other words, this listener will
   * be called BEFORE the previously added listener (if
   * there exists one) and so on.
   * 
   * @param {String} event 
   * @param {InputSourceEventListener} listener 
   */


  addEventListener(event, listener) {
    if (event in this.listeners) {
      this.listeners[event].unshift(listener);
    } else {
      this.listeners[event] = [listener];
    }
  }
  /**
   * Removes the listener from listening to the event.
   * 
   * @param {String} event 
   * @param {InputSourceEventListener} listener 
   */


  removeEventListener(event, listener) {
    if (event in this.listeners) {
      let list = this.listeners[event];
      let i = list.indexOf(listener);
      list.splice(i, 1);
    }
  }
  /**
   * Dispatches an event to the listeners.
   * 
   * @param {String} eventName The name of the event.
   * @param {InputSourceInputEvent|InputSourcePollEvent} event The event object to pass to listeners.
   */


  dispatchEvent(eventName, event) {
    for (let listener of this.listeners[eventName]) {
      listener(event);
    }
  }
  /**
   * @private
   * @param {InputSourceStage} stage 
   * @param {String} deviceName 
   * @param {String} keyCode 
   * @param {Axis|Button} input 
   */


  _dispatchInputEvent(stage, deviceName, keyCode, input) {
    this.dispatchEvent('input', {
      stage,
      deviceName,
      keyCode,
      input
    });
  }
  /** @private */


  _dispatchPollEvent() {
    this.dispatchEvent('poll', {});
  }
  /**
   * Poll the devices and update the input state.
   */


  poll() {
    for (const deviceName in this.inputs) {
      const inputMap = this.inputs[deviceName];

      for (const keyCode in inputMap) {
        let input = inputMap[keyCode];
        input.poll();

        this._dispatchInputEvent(InputSourceStage.POLL, deviceName, keyCode, input);
      }
    }

    this._dispatchPollEvent();
  }
  /** @private */


  onInputEvent(e) {
    const deviceName = e.deviceName;

    switch (e.type) {
      case InputType.KEY:
        {
          const keyCode = e.keyCode;
          let button = this.inputs[deviceName][keyCode];

          if (button) {
            button.update(e.event === InputEventCode.DOWN);

            this._dispatchInputEvent(InputSourceStage.UPDATE, deviceName, keyCode, button);
          }
        }
        break;

      case InputType.POS:
        {
          let inputs = this.inputs[deviceName];
          let xAxis = inputs.PosX;

          if (xAxis) {
            xAxis.update(e.x, e.dx);

            this._dispatchInputEvent(InputSourceStage.UPDATE, deviceName, 'PosX', xAxis);
          }

          let yAxis = inputs.PosY;

          if (yAxis) {
            yAxis.update(e.y, e.dy);

            this._dispatchInputEvent(InputSourceStage.UPDATE, deviceName, 'PosY', yAxis);
          }
        }
        break;

      case InputType.WHEEL:
        {
          let inputs = this.inputs[deviceName];
          let xAxis = inputs.WheelX;

          if (xAxis) {
            xAxis.update(e.dx, e.dx);

            this._dispatchInputEvent(InputSourceStage.UPDATE, deviceName, 'WheelX', xAxis);
          }

          let yAxis = inputs.WheelY;

          if (yAxis) {
            yAxis.update(e.dy, e.dy);

            this._dispatchInputEvent(InputSourceStage.UPDATE, deviceName, 'WheelY', yAxis);
          }

          let zAxis = inputs.WheelZ;

          if (zAxis) {
            zAxis.update(e.dz, e.dz);

            this._dispatchInputEvent(InputSourceStage.UPDATE, deviceName, 'WheelZ', zAxis);
          }
        }
        break;
    }
  }
  /**
   * Add an input for the given device and key code.
   * 
   * @param {String} deviceName 
   * @param {String} keyCode 
   */


  add(deviceName, keyCode) {
    if (!(deviceName in this.devices)) {
      throw new Error('Invalid device name - missing device with name in source.');
    }

    let result = isInputAxis(deviceName, keyCode) ? new Axis() : new Button();
    this.inputs[deviceName][keyCode] = result;
    return this;
  }
  /**
   * Remove the input for the given device and key code.
   * 
   * @param {String} deviceName 
   * @param {String} keyCode 
   */


  delete(deviceName, keyCode) {
    delete this.inputs[deviceName][keyCode];
  }
  /** @returns {Button|Axis} */


  get(deviceName, keyCode) {
    return this.inputs[deviceName][keyCode];
  }
  /**
   * @param {String} deviceName 
   * @param {String} keyCode 
   * @returns {Boolean} Whether the device and key code has been added.
   */


  has(deviceName, keyCode) {
    return deviceName in this.inputs && keyCode in this.inputs[deviceName];
  }
  /**
   * Removes all registered inputs from all devices.
   */


  clear() {
    for (let deviceName in this.devices) {
      this.inputs[deviceName] = {};
    }
  }

}

class InputContext {
  /**
   * Constructs a disabled InputContext with the given adapters and inputs.
   * 
   * @param {Object} [opts] Any additional options.
   * @param {Boolean} [opts.disabled=false] Whether the context should start disabled.
   */
  constructor(opts = {}) {
    const {
      disabled = true
    } = opts;
    /** @type {import('./source/InputSource.js').InputSource} */

    this.source = null;
    /** @private */

    this._disabled = disabled;
    /** @private */

    this._ignoreInput = disabled;
    /** @private */

    this.adapters = new AdapterManager();
    /** @private */

    this.inputs = {};
    /** @private */

    this.onSourceInput = this.onSourceInput.bind(this);
    /** @private */

    this.onSourcePoll = this.onSourcePoll.bind(this);
  }

  get disabled() {
    return this._disabled;
  }

  set disabled(value) {
    this.toggle(!value);
  }
  /**
   * @param {Object} inputMap The input to adapter options object map.
   * @returns {InputContext} Self for method-chaining.
   */


  setInputMap(inputMap) {
    this._setupInputs(this.source, inputMap);

    return this;
  }
  /**
   * @param {import('./source/InputSource.js').InputSource} inputSource The
   * source of all inputs listened to.
   * @returns {InputContext} Self for method-chaining.
   */


  attach(inputSource) {
    this._setupInputs(inputSource, null);

    this.toggle(true);
    return this;
  }
  /**
   * @returns {InputContext} Self for method-chaining.
   */


  detach() {
    this.toggle(false);

    this._setupInputs(null, null);

    return this;
  }
  /** @private */


  _setupInputs(inputSource, inputMap) {
    // Make sure this context is disabled before changing it...
    const prevDisabled = this.disabled;
    this.disabled = true; // Prepare previous state...

    const prevInputSource = this.source;
    const prevInputs = this.inputs;
    const isPrevSourceReplaced = prevInputSource !== inputSource && prevInputSource;
    const isPrevInputsReplaced = this.inputs && inputMap; // Tear down

    if (isPrevSourceReplaced || isPrevInputsReplaced) {
      if (isPrevSourceReplaced) {
        prevInputSource.removeEventListener('poll', this.onSourcePoll);
        prevInputSource.removeEventListener('input', this.onSourceInput);
      }

      for (let inputName in prevInputs) {
        let {
          adapters
        } = prevInputs[inputName];

        for (let adapter of adapters) {
          const {
            deviceName,
            keyCode
          } = adapter;
          let refCount = removeSourceRef(prevInputSource, deviceName, keyCode);

          if (refCount === 0) {
            prevInputSource.delete(deviceName, keyCode);
          }
        }
      }

      if (isPrevInputsReplaced) {
        this.adapters.clear();
        this.inputs = {};
      }
    } // Set up


    if (inputMap) {
      let inputs = {};

      for (let inputName in inputMap) {
        let adapterOptions = inputMap[inputName];
        let synthetic = new Synthetic(adapterOptions);
        let syntheticAdapters = synthetic.adapters;
        this.adapters.add(syntheticAdapters);
        inputs[inputName] = synthetic;
      }

      this.inputs = inputs;
    }

    if (inputSource) {
      initSourceRefs(inputSource);
      const inputs = this.inputs;

      for (let inputName in inputs) {
        let {
          adapters
        } = inputs[inputName];

        for (let adapter of adapters) {
          const {
            deviceName,
            keyCode
          } = adapter;
          let refCount = addSourceRef(inputSource, deviceName, keyCode);

          if (refCount === 1) {
            inputSource.add(deviceName, keyCode);
          }
        }
      }

      if (this.source !== inputSource) {
        inputSource.addEventListener('poll', this.onSourcePoll);
        inputSource.addEventListener('input', this.onSourceInput);
        this.source = inputSource;
      }
    } // Make sure this context returns to its previous expected state...


    this.disabled = prevDisabled;
  }
  /**
   * @private
   * @param {import('./source/InputSource.js').SourceInputEvent} e
   */


  onSourceInput(e) {
    if (!e.consumed && !this._ignoreInput) {
      const {
        stage,
        deviceName,
        keyCode,
        input
      } = e;

      switch (stage) {
        case InputSourceStage.POLL:
          this.adapters.poll(deviceName, keyCode, input);
          break;

        case InputSourceStage.UPDATE:
          this.adapters.update(deviceName, keyCode, input);
          break;
      }

      e.consumed = true;
    } else {
      const {
        deviceName,
        keyCode,
        input
      } = e;
      this.adapters.reset(deviceName, keyCode, input);
    }
  }
  /**
   * @private
   * @param {import('./source/InputSource.js').SourcePollEvent} e
   */


  onSourcePoll(e) {
    if (this._ignoreInput !== this.disabled) {
      this._ignoreInput = this.disabled;
    }
  }
  /**
   * Set the context to enabled/disabled.
   * 
   * @param {Boolean} [force] If defined, the context is enabled if true,
   * disabled if false. If undefined, it will toggle the current value.
   * @returns {InputContext} Self for method chaining.
   */


  toggle(force = this._disabled) {
    if (force) {
      if (!this.source) {
        throw new Error('Input source must be set before enabling input context.');
      }

      if (Object.keys(this.inputs).length <= 0) {
        console.warn('No inputs found for enabled input context - did you forget to setInputMap()?');
      }
    }

    this._disabled = !force;
    return this;
  }
  /**
   * Get the synthetic input object by name.
   * 
   * @param {String} inputName 
   * @returns {Synthetic} The synthetic input for the given input name.
   */


  getInput(inputName) {
    return this.inputs[inputName];
  }
  /**
   * Get the current value of the input by name.
   * 
   * @param {String} inputName
   * @returns {Number} The input value.
   */


  getInputValue(inputName) {
    if (inputName in this.inputs) {
      return this.inputs[inputName].value;
    } else {
      return 0;
    }
  }

}
const INPUT_SOURCE_INPUT_REF_COUNTS = Symbol('inputRefCounts');

function initSourceRefs(inputSource) {
  if (!(INPUT_SOURCE_INPUT_REF_COUNTS in inputSource)) {
    inputSource[INPUT_SOURCE_INPUT_REF_COUNTS] = {};
  }
}

function addSourceRef(inputSource, deviceName, keyCode) {
  const keyString = stringifyDeviceKeyCodePair(deviceName, keyCode);
  let refCounts = inputSource[INPUT_SOURCE_INPUT_REF_COUNTS];
  let value = refCounts[keyString] + 1 || 1;
  refCounts[keyString] = value;
  return value;
}

function removeSourceRef(inputSource, deviceName, keyCode) {
  const keyString = stringifyDeviceKeyCodePair(deviceName, keyCode);
  let refCounts = inputSource[INPUT_SOURCE_INPUT_REF_COUNTS];
  let value = refCounts[keyString] - 1 || 0;
  refCounts[keyString] = Math.max(value, 0);
  return value;
}

export { AdapterManager, Axis, Button, Input, InputContext, InputDevice, InputEventCode, InputSource, InputSourceStage, InputType, KEY_STRING_DEVICE_SEPARATOR, Keyboard, Mouse, Synthetic, WILDCARD_DEVICE_MATCHER, WILDCARD_KEY_MATCHER, isInputAxis, parseKeyString, stringifyDeviceKeyCodePair };
