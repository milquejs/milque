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
  /** @abstract */
  static isAxis(keyCode) {
    return false;
  }
  /** @abstract */


  static isButton(keyCode) {
    return false;
  }

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

/**
 * @typedef {import('../device/InputDevice.js').InputEventCode} InputEventCode
 */

/**
 * A class to represent the basic input interface.
 */
class Input {
  constructor() {
    /** The current state of the input. */
    this.value = 0;
    /** The previous state (after poll) of the input. */

    this.prev = 0; // TODO: Do we need a next? How do you tell if the update is a PRESS vs a HOLD?
  }

  update(value) {
    this.value = value;
  }

  poll() {
    this.prev = this.value;
    this.value = 0;
  }
  /**
   * @param {InputEventCode} eventCode
   * @returns {number} The event state.
   */


  getEvent(eventCode) {
    return 0;
  }

  getState() {
    return this.value;
  }

  getPrevState() {
    return this.prev;
  }

}

const KEY_STRING_DEVICE_SEPARATOR = ':';
class Synthetic extends Input {
  constructor() {
    super();
    this.update = this.update.bind(this);
    /** @private */

    this.adapters = [];
    /** @private */

    this.values = [];
    /** @private */

    this.next = {
      values: [],
      value: 0
    };
  }

  hydrate(adapterOptions) {
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

    this.adapters = adapterList;
    this.values = new Array(adapterList.length).fill(0);
    this.next = {
      values: new Array(adapterList.length).fill(0),
      value: 0
    };
  }
  /** @override */


  poll(value, adapter) {
    // Update previous state.
    this.prev = this.value; // Poll current state.

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
    this.prev = 0;
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
    // Update previous state.
    this.prev = this.value; // Update current state.

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
    // Update previous state.
    this.prev = this.value; // Poll current state.

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
 * @enum {number}
 */

const InputSourceEventStage = {
  NULL: 0,
  UPDATE: 1,
  POLL: 2
};
/**
 * @typedef InputSourceInputEvent
 * @property {InputSourceEventStage} stage
 * @property {string} deviceName
 * @property {string} keyCode
 * @property {Axis|Button} input
 * 
 * @typedef InputSourcePollEvent
 * 
 * @callback InputSourceEventListener
 * @param {InputSourceInputEvent|InputSourcePollEvent} e
 */

/**
 * A class to model the current input state with buttons and axes for devices.
 */

class InputEventSource {
  constructor(deviceList) {
    /** @private */
    this.onInputEvent = this.onInputEvent.bind(this);
    /** @private */

    this.onAnimationFrame = this.onAnimationFrame.bind(this);
    let deviceMap = {};
    let keyMap = {};

    for (let device of deviceList) {
      const deviceName = device.deviceName;

      if (deviceName in deviceMap) {
        throw new Error(`Another device with name '${deviceName}' already exists.`);
      }

      deviceMap[deviceName] = device;
      keyMap[deviceName] = {};
      device.addInputListener(WILDCARD_KEY_MATCHER, this.onInputEvent);
    }

    this.devices = deviceMap;
    this.keySources = keyMap;
    /** @private */

    this.listeners = {
      poll: [],
      update: []
    };
    /** @private */

    this._autopoll = false;
    /** @private */

    this._animationFrameHandle = null;
  }

  destroy() {
    this.clearKeySources();

    for (let deviceName in this.devices) {
      let device = this.devices[deviceName];
      device.removeInputListener(WILDCARD_KEY_MATCHER, this.onInputEvent);
      device.destroy();
    }

    this.devices = {};
  }
  /**
   * Poll the devices and update the input state.
   */


  poll(now = performance.now()) {
    for (const deviceName in this.keySources) {
      const keyMap = this.keySources[deviceName];

      for (const keyCode in keyMap) {
        let keyInput = keyMap[keyCode];
        keyInput.poll();
        this.dispatchInputEvent(InputSourceEventStage.POLL, deviceName, keyCode, keyInput);
      }
    }

    this.dispatchPollEvent(now);
  }
  /**
   * Add listener to listen for event, in order by most
   * recently added. In other words, this listener will
   * be called BEFORE the previously added listener (if
   * there exists one) and so on.
   * 
   * @param {string} event 
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
   * @param {string} event 
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
   * @param {string} event The event name.
   * @returns {number} The number of active listeners for the event.
   */


  countEventListeners(event) {
    if (!(event in this.listeners)) {
      throw new Error(`Cannot count listeners for unknown event '${event}'.`);
    }

    return this.listeners[event].length;
  }
  /**
   * Dispatches an event to the listeners.
   * 
   * @protected
   * @param {string} eventName The name of the event.
   * @param {InputSourceInputEvent|InputSourcePollEvent} event The event object to pass to listeners.
   */


  dispatchEvent(eventName, event) {
    for (let listener of this.listeners[eventName]) {
      listener(event);
    }
  }
  /**
   * @protected
   * @param {InputSourceEventStage} stage The current input event stage.
   * @param {string} deviceName The device from which the input event was fired.
   * @param {string} keyCode The triggered key code for this input event.
   * @param {Axis|Button} input The triggered input.
   */


  dispatchInputEvent(stage, deviceName, keyCode, input) {
    this.dispatchEvent('input', {
      stage,
      deviceName,
      keyCode,
      input
    });
  }
  /**
   * @protected
   * @param {number} now The currrent time in milliseconds.
   */


  dispatchPollEvent(now) {
    this.dispatchEvent('poll', {
      now
    });
  }
  /** @private */


  onInputEvent(e) {
    const deviceName = e.deviceName;

    switch (e.type) {
      case InputType.KEY:
        {
          const keyCode = e.keyCode;
          let button = this.keySources[deviceName][keyCode];

          if (button) {
            button.update(e.event === InputEventCode.DOWN);
            this.dispatchInputEvent(InputSourceEventStage.UPDATE, deviceName, keyCode, button);
            return true;
          }
        }
        break;

      case InputType.POS:
        {
          let inputs = this.keySources[deviceName];
          let xAxis = inputs.PosX;

          if (xAxis) {
            xAxis.update(e.x, e.dx);
            this.dispatchInputEvent(InputSourceEventStage.UPDATE, deviceName, 'PosX', xAxis);
          }

          let yAxis = inputs.PosY;

          if (yAxis) {
            yAxis.update(e.y, e.dy);
            this.dispatchInputEvent(InputSourceEventStage.UPDATE, deviceName, 'PosY', yAxis);
          }
        }
        break;

      case InputType.WHEEL:
        {
          let inputs = this.keySources[deviceName];
          let xAxis = inputs.WheelX;

          if (xAxis) {
            xAxis.update(e.dx, e.dx);
            this.dispatchInputEvent(InputSourceEventStage.UPDATE, deviceName, 'WheelX', xAxis);
          }

          let yAxis = inputs.WheelY;

          if (yAxis) {
            yAxis.update(e.dy, e.dy);
            this.dispatchInputEvent(InputSourceEventStage.UPDATE, deviceName, 'WheelY', yAxis);
          }

          let zAxis = inputs.WheelZ;

          if (zAxis) {
            zAxis.update(e.dz, e.dz);
            this.dispatchInputEvent(InputSourceEventStage.UPDATE, deviceName, 'WheelZ', zAxis);
          }
        }
        break;
    }
  }
  /** @private */


  onAnimationFrame(now) {
    if (!this._autopoll) return;
    this._animationFrameHandle = requestAnimationFrame(this.onAnimationFrame);
    this.poll(now);
  }

  set autopoll(value) {
    this._autopoll = value;

    if (this._animationFrameHandle) {
      // Stop animation frame loop
      cancelAnimationFrame(this._animationFrameHandle);
      this._animationFrameHandle = null;
    }

    if (value) {
      // Start animation frame loop
      this._animationFrameHandle = requestAnimationFrame(this.onAnimationFrame);
    }
  }
  /** @returns {boolean} Whether to automatically poll on animation frame. */


  get autopoll() {
    return this._autopoll;
  }
  /**
   * Add an input for the given device and key code.
   * 
   * @param {String} deviceName 
   * @param {String} keyCode 
   */


  addKeySource(deviceName, keyCode) {
    if (!(deviceName in this.devices)) {
      throw new Error('Invalid device name - missing device with name in source.');
    }

    let device = this.devices[deviceName];
    let result;

    if (device.constructor.isAxis(keyCode)) {
      result = new Axis();
    } else if (device.constructor.isButton(keyCode)) {
      result = new Button();
    } else {
      throw new Error(`Unknown key code '${keyCode}' for device ${deviceName}.`);
    }

    let prev = this.keySources[deviceName][keyCode];

    if (prev) {
      throw new Error('Cannot add duplicate key source for the same device and key code.');
    }

    this.keySources[deviceName][keyCode] = result;
    return this;
  }
  /**
   * Remove the input for the given device and key code.
   * 
   * @param {String} deviceName 
   * @param {String} keyCode 
   */


  deleteKeySource(deviceName, keyCode) {
    let prev = this.keySources[deviceName][keyCode];

    if (!prev) {
      throw new Error('Cannot delete missing key source for the device and key code.');
    }

    delete this.keySources[deviceName][keyCode];
  }
  /** @returns {Button|Axis} */


  getKeySource(deviceName, keyCode) {
    return this.keySources[deviceName][keyCode];
  }
  /**
   * @param {String} deviceName 
   * @param {String} keyCode 
   * @returns {Boolean} Whether the device and key code has been added.
   */


  hasKeySource(deviceName, keyCode) {
    return deviceName in this.keySources && keyCode in this.keySources[deviceName];
  }
  /**
   * Removes all registered inputs from all devices.
   */


  clearKeySources() {
    for (let deviceName in this.devices) {
      this.keySources[deviceName] = {};
    }
  }

}

var INNER_HTML = "<div>\n    <label id=\"title\">\n        input-source\n    </label>\n    <span>|</span>\n    <p>\n        <label for=\"poll\">poll</label>\n        <output id=\"poll\"></output>\n    </p>\n    <p>\n        <label for=\"focus\">focus</label>\n        <output id=\"focus\"></output>\n    </p>\n</div>\n";

var INNER_STYLE = ":host{display:inline-block}div{font-family:monospace;color:#666;outline:1px solid #666;padding:4px}p{display:inline;margin:0;padding:0}#focus:empty:after,#poll:empty:after{content:\"✗\";color:red}";

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
  /** @override */
  static isAxis(keyCode) {
    return false;
  }
  /** @override */


  static isButton(keyCode) {
    return true;
  }
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
  /** @override */
  static isAxis(keyCode) {
    return keyCode === 'PosX' || keyCode === 'PosY' || keyCode === 'WheelX' || keyCode === 'WheelY' || keyCode === 'WheelZ';
  }
  /** @override */


  static isButton(keyCode) {
    return !this.isAxis(keyCode);
  }
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

/** This holds the ref count for each key source per input event source. */

const KEY_SOURCE_REF_COUNT_KEY = Symbol('keySourceRefCount');

function initKeySourceRefs(eventSource) {
  if (!(KEY_SOURCE_REF_COUNT_KEY in eventSource)) {
    eventSource[KEY_SOURCE_REF_COUNT_KEY] = {};
  }
}

function addKeySourceRef(eventSource, deviceName, keyCode) {
  const keyString = stringifyDeviceKeyCodePair(deviceName, keyCode);
  let refCounts = eventSource[KEY_SOURCE_REF_COUNT_KEY];
  let value = refCounts[keyString] + 1 || 1;
  refCounts[keyString] = value;
  return value;
}

function removeKeySourceRef(eventSource, deviceName, keyCode) {
  const keyString = stringifyDeviceKeyCodePair(deviceName, keyCode);
  let refCounts = eventSource[KEY_SOURCE_REF_COUNT_KEY];
  let value = refCounts[keyString] - 1 || 0;
  refCounts[keyString] = Math.max(value, 0);
  return value;
}

function clearKeySourceRefs(eventSource) {
  eventSource[KEY_SOURCE_REF_COUNT_KEY] = {};
}
/** This determines whether an element has an associated input event source. */


const INPUT_EVENT_SOURCE_KEY = Symbol('inputEventSource');
/**
 * @param {EventTarget} eventTarget The target element to listen to.
 * @returns {boolean} Whether the event target has an associated input source.
 */

function hasInputEventSource(eventTarget) {
  return Object.prototype.hasOwnProperty.call(eventTarget, INPUT_EVENT_SOURCE_KEY) && Object.getOwnPropertyDescriptor(eventTarget, INPUT_EVENT_SOURCE_KEY).value;
}
/**
 * @param {EventTarget} eventTarget The target element to listen to.
 * @returns {InputEventSource} The active input event source for the target element.
 */

function getInputEventSource(eventTarget) {
  return Object.getOwnPropertyDescriptor(eventTarget, INPUT_EVENT_SOURCE_KEY).value;
}
/**
 * @param {EventTarget} eventTarget The target element to listen to.
 * @param {InputSource} inputSource The input source to be associated with the event target element.
 */

function setInputEventSource(eventTarget, inputEventSource) {
  Object.defineProperty(eventTarget, INPUT_EVENT_SOURCE_KEY, {
    value: inputEventSource,
    configurable: true
  });
}
/**
 * @param {EventTarget} eventTarget The target element listened to.
 */

function deleteInputEventSource(eventTarget) {
  Object.defineProperty(eventTarget, INPUT_EVENT_SOURCE_KEY, {
    value: null,
    configurable: true
  });
}
class InputSource extends HTMLElement {
  /** Generated by cuttle.js */
  static get [Symbol.for("cuttleTemplate")]() {
    let t = document.createElement("template");
    t.innerHTML = INNER_HTML;
    Object.defineProperty(this, Symbol.for("cuttleTemplate"), {
      value: t
    });
    return t;
  }

  /** Generated by cuttle.js */
  static get [Symbol.for("cuttleStyle")]() {
    let s = document.createElement("style");
    s.innerHTML = INNER_STYLE;
    Object.defineProperty(this, Symbol.for("cuttleStyle"), {
      value: s
    });
    return s;
  }

  /**
   * Get the associated input source for the given event target.
   * 
   * @param {EventTarget} eventTarget The target element to listen
   * for all input events.
   * @returns {InputSource} The input source for the given event target.
   */
  static for(eventTarget) {
    return new InputSource(eventTarget);
  }
  /** @override */


  static get observedAttributes() {
    return ["oninput", "onpoll", "for", "autopoll", // Listening for built-in attribs
    'id', 'class'];
  }

  static get properties() {
    return {
      for: String,
      autopoll: Boolean
    };
  }

  get autopoll() {
    return this._autopoll;
  }

  set autopoll(value) {
    this.toggleAttribute("autopoll", value);
  }

  get for() {
    return this._for;
  }

  set for(value) {
    this.setAttribute("for", value);
  }

  static get customEvents() {
    return ['input', 'poll'];
  }
  /**
   * @param {EventTarget} [eventTarget] The event target to listen for all input events.
   */


  get onpoll() {
    return this._onpoll;
  }

  set onpoll(value) {
    if (this._onpoll) this.removeEventListener("poll", this._onpoll);
    this._onpoll = value;
    if (this._onpoll) this.addEventListener("poll", value);
  }

  get oninput() {
    return this._oninput;
  }

  set oninput(value) {
    if (this._oninput) this.removeEventListener("input", this._oninput);
    this._oninput = value;
    if (this._oninput) this.addEventListener("input", value);
  }

  constructor(eventTarget = undefined) {
    super();
    this.attachShadow({
      mode: 'open'
    });
    this.shadowRoot.appendChild(this.constructor[Symbol.for("cuttleTemplate")].content.cloneNode(true));
    this.shadowRoot.appendChild(this.constructor[Symbol.for("cuttleStyle")].cloneNode(true));
    /** @private */

    this._containerElement = this.shadowRoot.querySelector('div');
    /** @private */

    this._titleElement = this.shadowRoot.querySelector('#title');
    /** @private */

    this._pollElement = this.shadowRoot.querySelector('#poll');
    /** @private */

    this._focusElement = this.shadowRoot.querySelector('#focus');
    /** @private */

    this._pollCount = 0;
    /** @private */

    this._pollCountDelay = 0;
    /**
     * @private
     * @type {EventTarget}
     */

    this._eventTarget = null;
    /**
     * @private
     * @type {InputEventSource}
     */

    this._eventSource = null;
    this._keySourceRefCount = {};
    /** @private */

    this.onSourcePoll = this.onSourcePoll.bind(this);
    /** @private */

    this.onSourceInput = this.onSourceInput.bind(this);
    /** @private */

    this.onTargetFocus = this.onTargetFocus.bind(this);
    /** @private */

    this.onTargetBlur = this.onTargetBlur.bind(this);

    if (eventTarget) {
      this.setEventTarget(eventTarget);
    }
  }
  /** @override */


  connectedCallback() {
    if (Object.prototype.hasOwnProperty.call(this, "oninput")) {
      let value = this.oninput;
      delete this.oninput;
      this.oninput = value;
    }

    if (Object.prototype.hasOwnProperty.call(this, "onpoll")) {
      let value = this.onpoll;
      delete this.onpoll;
      this.onpoll = value;
    }

    if (Object.prototype.hasOwnProperty.call(this, "for")) {
      let value = this.for;
      delete this.for;
      this.for = value;
    }

    if (Object.prototype.hasOwnProperty.call(this, "autopoll")) {
      let value = this.autopoll;
      delete this.autopoll;
      this.autopoll = value;
    }

    // Allows this element to be focusable
    if (!this.hasAttribute('tabindex')) this.setAttribute('tabindex', 0); // Initialize input source event target as self, if unset

    if (!this.hasAttribute('for') && !this._eventTarget) {
      this.setEventTarget(this);
    }
  }

  /** @override */
  disconnectedCallback() {
    this.clearEventTarget();
  }
  /** @override */


  attributeChangedCallback(attribute, prev, value) {
    /** Generated by cuttle.js */
    switch (attribute) {
      case "for":
        this._for = value;
        break;

      case "autopoll":
        {
          this._autopoll = value !== null;
        }
        break;

      case "oninput":
        {
          this.oninput = new Function('event', 'with(document){with(this){' + value + '}}').bind(this);
        }
        break;

      case "onpoll":
        {
          this.onpoll = new Function('event', 'with(document){with(this){' + value + '}}').bind(this);
        }
        break;
    }

    ((attribute, prev, value) => {
      switch (attribute) {
        case 'for':
          this.setEventTarget(value ? document.getElementById(value) : this);
          break;
        // For debug info

        case 'id':
        case 'class':
          {
            let cname = this.className ? '.' + this.className : '';
            let iname = this.hasAttribute('id') ? '#' + this.getAttribute('id') : '';
            this._titleElement.innerHTML = cname + iname;
          }
          break;
      }
    })(attribute, prev, value);
  }
  /**
   * Poll input state from devices.
   * 
   * @param {number} now The current time in milliseconds.
   */


  poll(now) {
    this._eventSource.poll(now);
  }
  /** @private */


  onSourceInput({
    stage,
    deviceName,
    keyCode,
    input
  }) {
    this.dispatchEvent(new CustomEvent('input', {
      composed: true,
      bubbles: false,
      detail: {
        stage,
        deviceName,
        keyCode,
        input
      }
    }));
  }
  /** @private */


  onSourcePoll({
    now
  }) {
    this._pollCount += 1;
    this.dispatchEvent(new CustomEvent('poll', {
      composed: true,
      bubbles: false
    }));
    let dt = now - this._pollCountDelay;

    if (dt > 1000) {
      this._pollCountDelay = now;

      if (this._pollCount > 0) {
        this._pollElement.innerHTML = '✓';
        this._pollCount = 0;
      } else {
        this._pollElement.innerHTML = '';
      }
    }
  }
  /** @private */


  onTargetFocus() {
    this._focusElement.innerHTML = '✓';
  }
  /** @private */


  onTargetBlur() {
    this._focusElement.innerHTML = '';
  }
  /** @private */


  setEventTarget(eventTarget) {
    this.clearEventTarget();

    if (!eventTarget) {
      throw new Error('Cannot set null as event target for input source.');
    }

    let eventSource;

    if (!hasInputEventSource(eventTarget)) {
      eventSource = new InputEventSource([new Keyboard(eventTarget), new Mouse(eventTarget)]);
      setInputEventSource(eventTarget, eventSource);
      initKeySourceRefs(eventSource);
    } else {
      eventSource = getInputEventSource(eventTarget);
    }

    this._eventSource = eventSource;
    this._eventTarget = eventTarget; // TODO: Need to revisit whether this is a good way to set autopoll.
    // NOTE: Auto-poll can only be turned on and only during init.

    let autopoll = this.autopoll;

    if (autopoll) {
      this._eventSource.autopoll = autopoll;
    }

    eventSource.addEventListener('poll', this.onSourcePoll);
    eventSource.addEventListener('input', this.onSourceInput);
    eventTarget.addEventListener('focus', this.onTargetFocus);
    eventTarget.addEventListener('blur', this.onTargetBlur);
  }
  /** @private */


  clearEventTarget() {
    let eventTarget = this._eventTarget;
    let eventSource = this._eventSource;
    this._eventTarget = null;
    this._eventSource = null;

    if (eventTarget) {
      eventTarget.removeEventListener('focus', this.onTargetFocus);
      eventTarget.removeEventListener('blur', this.onTargetBlur); // Event source should also exist if event target was setup.

      eventSource.removeEventListener('poll', this.onSourcePoll);
      eventSource.removeEventListener('input', this.onSourceInput); // Clean up event source if no longer used.

      if (eventSource.countEventListeners('input') <= 0) {
        eventSource.destroy();
        deleteInputEventSource(eventTarget);
      }
    }
  }

  enableKeySource(deviceName, keyCode) {
    if (!deviceName || !keyCode) {
      throw new Error('Invalid device name or key code for key source.');
    }

    let eventSource = this._eventSource;
    let refCount = addKeySourceRef(eventSource, deviceName, keyCode);

    if (refCount === 1) {
      eventSource.addKeySource(deviceName, keyCode);
    }
  }

  disableKeySource(deviceName, keyCode) {
    if (!deviceName || !keyCode) {
      throw new Error('Invalid device name or key code for key source.');
    }

    let eventSource = this._eventSource;
    let refCount = removeKeySourceRef(eventSource, deviceName, keyCode);

    if (refCount === 0) {
      eventSource.deleteKeySource(deviceName, keyCode);
    }
  }

  getKeySource(deviceName, keyCode) {
    if (!deviceName || !keyCode) {
      throw new Error('Invalid device name or key code for key source.');
    }

    return this._eventSource.getKeySource(deviceName, keyCode);
  }

  hasKeySource(deviceName, keyCode) {
    if (!deviceName || !keyCode) {
      throw new Error('Invalid device name or key code for key source.');
    }

    return this._eventSource.hasKeySource(deviceName, keyCode);
  }

  clearKeySources() {
    let eventSource = this._eventSource;
    eventSource.clearKeySources();
    clearKeySourceRefs(eventSource);
  }

  get keySources() {
    return this._eventSource.keySources;
  }

  get devices() {
    return this._eventSource.devices;
  }

}
window.customElements.define('input-source', InputSource);

class InputContext {
  /**
   * Constructs a disabled InputContext with the given adapters and inputs.
   * 
   * @param {EventTarget|InputSource} [inputSource=null] The source of all inputs listened to.
   * @param {Object} [inputMap=null] The input to adapter options object map.
   * @param {Boolean} [disabled=true] Whether the context should start disabled.
   */
  constructor(inputSource = null, inputMap = null, disabled = true) {
    /** @type {InputSource} */
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

    if (inputSource || inputMap) {
      this._setupInputs(resolveInputSource(inputSource), inputMap);
    }

    if (!disabled) {
      this.attach();
    }
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
   * @param {EventTarget|InputSource} inputSource The source of all inputs listened to.
   * @returns {InputContext} Self for method-chaining.
   */


  setInputSource(inputSource) {
    this._setupInputs(resolveInputSource(inputSource), null);

    return this;
  }
  /**
   * @returns {InputContext} Self for method-chaining.
   */


  attach() {
    if (!this.source) {
      throw new Error('Missing input source to attach context.');
    }

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
  /**
   * @private
   * @param {InputSource} inputSource
   * @param {object} inputMap
   */


  _setupInputs(inputSource, inputMap) {
    // Make sure this context is disabled before changing it...
    const prevDisabled = this.disabled;
    this.disabled = true; // Prepare previous state...

    /** @type {InputSource} */

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
          prevInputSource.disableKeySource(deviceName, keyCode);
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
        let synthetic = prevInputs[inputName] || new Synthetic();
        synthetic.hydrate(adapterOptions);
        let syntheticAdapters = synthetic.adapters;
        this.adapters.add(syntheticAdapters);
        inputs[inputName] = synthetic;
      }

      this.inputs = inputs;
    }

    if (inputSource) {
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
          inputSource.enableKeySource(deviceName, keyCode);
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
   * @param {import('./source/InputEventSource.js').SourceInputEvent} e
   */


  onSourceInput(e) {
    if (!e.detail.consumed && !this._ignoreInput) {
      const {
        stage,
        deviceName,
        keyCode,
        input
      } = e.detail;

      switch (stage) {
        case InputSourceEventStage.POLL:
          this.adapters.poll(deviceName, keyCode, input);
          break;

        case InputSourceEventStage.UPDATE:
          this.adapters.update(deviceName, keyCode, input);
          break;

        default:
          throw new Error('Unknown input source stage.');
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
   * @param {import('./source/InputEventSource.js').SourcePollEvent} e
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
    if (inputName in this.inputs) {
      return this.inputs[inputName];
    } else {
      let synthetic = new Synthetic();
      this.inputs[inputName] = synthetic;
      return synthetic;
    }
  }

  hasInput(inputName) {
    return inputName in this.inputs && this.inputs[inputName].adapters.length > 0;
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

  getInputState(inputName) {
    return this.getInputValue(inputName);
  }

  getInputChanged(inputName) {
    if (inputName in this.inputs) {
      let input = this.inputs[inputName];
      return input.value - input.prev;
    } else {
      return 0;
    }
  }

}

function resolveInputSource(inputSourceOrEventTarget) {
  if (!(inputSourceOrEventTarget instanceof InputSource)) {
    let eventTarget = inputSourceOrEventTarget;
    let flag = hasInputEventSource(eventTarget);
    let result = new InputSource(eventTarget);

    if (!flag) {
      // By default, all NEW input sources resolved from event targets should autopoll.
      result.autopoll = true;
    }

    return result;
  } else {
    return inputSourceOrEventTarget;
  }
}

var INNER_HTML$1 = "<kbd>\n    <span id=\"key\"><slot></slot></span>\n    <span id=\"value\" class=\"hidden\"></span>\n</kbd>\n";

var INNER_STYLE$1 = "kbd{position:relative;display:inline-block;border-radius:3px;border:1px solid #888;font-size:.85em;font-weight:700;text-rendering:optimizeLegibility;line-height:12px;height:14px;padding:2px 4px;color:#444;background-color:#eee;box-shadow:inset 0 -3px 0 #aaa;overflow:hidden}kbd:empty:after{content:\"<?>\";opacity:.6}.disabled{opacity:.6;box-shadow:none;background-color:#aaa}.hidden{display:none}#value{position:absolute;top:0;bottom:0;right:0;font-size:.85em;padding:2px 4px 0;color:#ccc;background-color:#333;box-shadow:inset 0 3px 0 #222}";

class InputKeyElement extends HTMLElement {
  /** Generated by cuttle.js */
  static get [Symbol.for("cuttleTemplate")]() {
    let t = document.createElement("template");
    t.innerHTML = INNER_HTML$1;
    Object.defineProperty(this, Symbol.for("cuttleTemplate"), {
      value: t
    });
    return t;
  }

  /** Generated by cuttle.js */
  static get [Symbol.for("cuttleStyle")]() {
    let s = document.createElement("style");
    s.innerHTML = INNER_STYLE$1;
    Object.defineProperty(this, Symbol.for("cuttleStyle"), {
      value: s
    });
    return s;
  }

  static get properties() {
    return {
      name: String,
      value: String,
      disabled: Boolean
    };
  }

  get disabled() {
    return this._disabled;
  }

  set disabled(value) {
    this.toggleAttribute("disabled", value);
  }

  get value() {
    return this._value;
  }

  set value(value) {
    this.setAttribute("value", value);
  }

  get name() {
    return this._name;
  }

  set name(value) {
    this.setAttribute("name", value);
  }

  constructor() {
    super();
    this.attachShadow({
      mode: 'open'
    });
    this.shadowRoot.appendChild(this.constructor[Symbol.for("cuttleTemplate")].content.cloneNode(true));
    this.shadowRoot.appendChild(this.constructor[Symbol.for("cuttleStyle")].cloneNode(true));
    this._keyboardElement = this.shadowRoot.querySelector('kbd');
    this._keyElement = this.shadowRoot.querySelector('#key');
    this._valueElement = this.shadowRoot.querySelector('#value');
  }
  /** @override */


  attributeChangedCallback(attribute, prev, value) {
    /** Generated by cuttle.js */
    switch (attribute) {
      case "name":
        this._name = value;
        break;

      case "value":
        this._value = value;
        break;

      case "disabled":
        {
          this._disabled = value !== null;
        }
        break;
    }

    ((attribute, prev, value) => {
      switch (attribute) {
        case 'name':
          this._keyElement.innerText = value;
          break;

        case 'value':
          if (value !== null) {
            this._valueElement.classList.toggle('hidden', false);

            this._valueElement.innerText = value;
            this._keyboardElement.style.paddingRight = `${this._valueElement.clientWidth + 4}px`;
          } else {
            this._valueElement.classList.toggle('hidden', true);
          }

          break;

        case 'disabled':
          this._keyboardElement.classList.toggle('disabled', value !== null);

          break;
      }
    })(attribute, prev, value);
  }

  connectedCallback() {
    if (Object.prototype.hasOwnProperty.call(this, "name")) {
      let value = this.name;
      delete this.name;
      this.name = value;
    }

    if (Object.prototype.hasOwnProperty.call(this, "value")) {
      let value = this.value;
      delete this.value;
      this.value = value;
    }

    if (Object.prototype.hasOwnProperty.call(this, "disabled")) {
      let value = this.disabled;
      delete this.disabled;
      this.disabled = value;
    }
  }

  static get observedAttributes() {
    return ["name", "value", "disabled"];
  }

}
window.customElements.define('input-key', InputKeyElement);

var INNER_HTML$2 = "<table>\n    <thead>\n        <tr class=\"tableHeader\">\n            <th colspan=4>\n                <slot id=\"title\">input-map</slot>\n            </th>\n        </tr>\n        <tr class=\"colHeader\">\n            <th>name</th>\n            <th>key</th>\n            <th>mod</th>\n            <th>value</th>\n        </tr>\n    </thead>\n    <tbody>\n    </tbody>\n</table>\n";

var INNER_STYLE$2 = ":host{display:block}table{border-collapse:collapse}table,td,th{border:1px solid #666}td,th{padding:5px 10px}td{text-align:center}thead th{padding:0}.colHeader>th{font-size:.8em;padding:0 10px;letter-spacing:3px;background-color:#aaa;color:#666}.colHeader>th,output{font-family:monospace}output{border-radius:.3em;padding:3px}tr:not(.primary) .name,tr:not(.primary) .value{opacity:.3}tr:nth-child(2n){background-color:#eee}";

function upgradeProperty(element, propertyName) {
  if (Object.prototype.hasOwnProperty.call(element, propertyName)) {
    let value = element[propertyName];
    delete element[propertyName];
    element[propertyName] = value;
  }
}

class InputMapElement extends HTMLElement {
  /** Generated by cuttle.js */
  static get [Symbol.for("cuttleTemplate")]() {
    let t = document.createElement("template");
    t.innerHTML = INNER_HTML$2;
    Object.defineProperty(this, Symbol.for("cuttleTemplate"), {
      value: t
    });
    return t;
  }

  /** Generated by cuttle.js */
  static get [Symbol.for("cuttleStyle")]() {
    let s = document.createElement("style");
    s.innerHTML = INNER_STYLE$2;
    Object.defineProperty(this, Symbol.for("cuttleStyle"), {
      value: s
    });
    return s;
  }

  static get customEvents() {
    return ['load'];
  }
  /** @override */


  get onload() {
    return this._onload;
  }

  set onload(value) {
    if (this._onload) this.removeEventListener("load", this._onload);
    this._onload = value;
    if (this._onload) this.addEventListener("load", value);
  }

  static get observedAttributes() {
    return ["onload", 'src', // Listening for built-in attribs
    'id', 'class'];
  }

  constructor() {
    super();
    this.attachShadow({
      mode: 'open'
    });
    this.shadowRoot.appendChild(this.constructor[Symbol.for("cuttleTemplate")].content.cloneNode(true));
    this.shadowRoot.appendChild(this.constructor[Symbol.for("cuttleStyle")].cloneNode(true));
    this._src = '';
    this._inputMap = null;
    this._tableElements = {};
    this._titleElement = this.shadowRoot.querySelector('#title');
    this._bodyElement = this.shadowRoot.querySelector('tbody');
    this._children = this.shadowRoot.querySelector('slot');
  }

  get map() {
    return this._inputMap;
  }

  get mapElements() {
    return this._tableElements;
  }
  /** @override */


  connectedCallback() {
    if (Object.prototype.hasOwnProperty.call(this, "onload")) {
      let value = this.onload;
      delete this.onload;
      this.onload = value;
    }

    upgradeProperty(this, 'src');
  }

  /** @override */
  attributeChangedCallback(attribute, prev, value) {
    /** Generated by cuttle.js */
    switch (attribute) {
      case "onload":
        {
          this.onload = new Function('event', 'with(document){with(this){' + value + '}}').bind(this);
        }
        break;
    }

    ((attribute, prev, value) => {
      switch (attribute) {
        case 'src':
          if (this._src !== value) {
            this._src = value;

            if (value.trim().startsWith('{')) {
              let jsonData = JSON.parse(value);

              this._setInputMap(jsonData);
            } else {
              fetch(value).then(fileBlob => fileBlob.json()).then(jsonData => this._setInputMap(jsonData));
            }
          }

          break;
        // For debug info

        case 'id':
        case 'class':
          this._titleElement.innerHTML = `input-port${this.className ? '.' + this.className : ''}${this.hasAttribute('id') ? '#' + this.getAttribute('id') : ''}`;
          break;
      }
    })(attribute, prev, value);
  }

  get src() {
    return this.getAttribute('src');
  }

  set src(value) {
    switch (typeof value) {
      case 'object':
        {
          let src = JSON.stringify(value);
          this._src = src;

          this._setInputMap(value);

          this.setAttribute('src', src);
        }
        break;

      case 'string':
        this.setAttribute('src', value);
        break;

      default:
        this.setAttribute('src', JSON.stringify(value));
        break;
    }
  }

  _setInputMap(inputMap) {
    let entryMap = {};
    let entryList = [];

    for (let name in inputMap) {
      let input = inputMap[name];
      let entries = [];
      inputToTableEntries(entries, name, input);
      entryMap[name] = entries;
      entryList.push(...entries);
    }

    this._bodyElement.innerHTML = '';

    for (let entry of entryList) {
      this._bodyElement.appendChild(entry);
    }

    this._inputMap = inputMap;
    this._tableElements = entryMap;
    this.dispatchEvent(new CustomEvent('load', {
      bubbles: false,
      composed: true,
      detail: {
        map: inputMap
      }
    }));
  }

}
window.customElements.define('input-map', InputMapElement);

function inputToTableEntries(out, name, input) {
  if (Array.isArray(input)) {
    inputToTableEntries(out, name, input[0]);
    let length = input.length;

    for (let i = 1; i < length; ++i) {
      out.push(parseInputOption(name, input[i], false));
    }
  } else {
    out.push(parseInputOption(name, input, true));
  }

  return out;
}

function parseInputOption(inputName, inputOption, inputPrimary = true) {
  if (typeof inputOption === 'object') {
    const {
      key,
      event,
      scale
    } = inputOption;
    return createInputTableEntry(inputName, key, event, scale, 0, inputPrimary);
  } else {
    return createInputTableEntry(inputName, inputOption, null, 1, 0, inputPrimary);
  }
}

function createInputTableEntry(name, key, event, scale, value, primary = true) {
  let row = document.createElement('tr');
  if (primary) row.classList.add('primary'); // Name

  {
    let data = document.createElement('td');
    data.textContent = name;
    data.classList.add('name');
    row.appendChild(data);
  } // Key

  {
    let data = document.createElement('td');
    data.classList.add('key');
    let kbd = new InputKeyElement();
    kbd.innerText = key;
    data.appendChild(kbd);
    row.appendChild(data);
  } // Modifiers

  {
    let data = document.createElement('td');
    let samp = document.createElement('samp');
    let modifiers = [];

    if (typeof event === 'string' && event !== 'null') {
      modifiers.push(event);
    }

    if (typeof scale === 'number' && scale !== 1) {
      modifiers.push(`\u00D7(${scale.toFixed(2)})`);
    }

    samp.innerText = modifiers.join(' ');
    data.classList.add('mod');
    data.appendChild(samp);
    row.appendChild(data);
  } // Value

  {
    let data = document.createElement('td');
    let output = document.createElement('output');
    output.innerText = Number(value).toFixed(2);
    output.classList.add('value');
    data.appendChild(output);
    row.appendChild(data);
  }
  return row;
}

var INNER_HTML$3 = "<input-map>\n    <slot></slot>\n    <input-source></input-source>\n</input-map>\n";

var INNER_STYLE$3 = ":host{display:inline-block}";

function upgradeProperty$1(element, propertyName) {
  if (Object.prototype.hasOwnProperty.call(element, propertyName)) {
    let value = element[propertyName];
    delete element[propertyName];
    element[propertyName] = value;
  }
}

class InputContextElement extends HTMLElement {
  /** Generated by cuttle.js */
  static get [Symbol.for("cuttleTemplate")]() {
    let t = document.createElement("template");
    t.innerHTML = INNER_HTML$3;
    Object.defineProperty(this, Symbol.for("cuttleTemplate"), {
      value: t
    });
    return t;
  }

  /** Generated by cuttle.js */
  static get [Symbol.for("cuttleStyle")]() {
    let s = document.createElement("style");
    s.innerHTML = INNER_STYLE$3;
    Object.defineProperty(this, Symbol.for("cuttleStyle"), {
      value: s
    });
    return s;
  }

  static get properties() {
    return {
      // src: A custom type,
      for: String,
      disabled: Boolean
    };
  }
  /** @override */


  get disabled() {
    return this._disabled;
  }

  set disabled(value) {
    this.toggleAttribute("disabled", value);
  }

  /* src: A custom type,*/
  get for() {
    return this._for;
  }

  set for(value) {
    this.setAttribute("for", value);
  }

  static get observedAttributes() {
    return ["for", "disabled", 'src', // Listening for built-in attribs
    'id', 'class'];
  }

  constructor() {
    super();
    this.attachShadow({
      mode: 'open'
    });
    this.shadowRoot.appendChild(this.constructor[Symbol.for("cuttleTemplate")].content.cloneNode(true));
    this.shadowRoot.appendChild(this.constructor[Symbol.for("cuttleStyle")].cloneNode(true));
    this._inputContext = new InputContext();
    this._mapElement = this.shadowRoot.querySelector('input-map');
    this._sourceElement = this.shadowRoot.querySelector('input-source');
    this.onInputMapLoad = this.onInputMapLoad.bind(this);
    this.onInputSourcePoll = this.onInputSourcePoll.bind(this);

    this._mapElement.addEventListener('load', this.onInputMapLoad);

    this._sourceElement.addEventListener('poll', this.onInputSourcePoll);
  }

  get context() {
    return this._inputContext;
  }

  get source() {
    return this._sourceElement;
  }

  get map() {
    return this._mapElement.map;
  }

  onInputMapLoad() {
    let source = this._sourceElement;
    let map = this._mapElement.map;

    if (source && map) {
      this._inputContext.setInputMap(map).setInputSource(source).attach();

      this._inputContext.disabled = this._disabled;
    }
  }

  onInputSourcePoll() {
    for (let [inputName, entries] of Object.entries(this._mapElement.mapElements)) {
      let value = this._inputContext.getInputValue(inputName);

      let primary = entries[0];
      let outputElement = primary.querySelector('output');
      outputElement.innerText = Number(value).toFixed(2);
    }
  }
  /** @override */


  connectedCallback() {
    if (Object.prototype.hasOwnProperty.call(this, "for")) {
      let value = this.for;
      delete this.for;
      this.for = value;
    }

    if (Object.prototype.hasOwnProperty.call(this, "disabled")) {
      let value = this.disabled;
      delete this.disabled;
      this.disabled = value;
    }

    upgradeProperty$1(this, 'src');
  }

  /** @override */
  attributeChangedCallback(attribute, prev, value) {
    /** Generated by cuttle.js */
    switch (attribute) {
      case "for":
        this._for = value;
        break;

      case "disabled":
        {
          this._disabled = value !== null;
        }
        break;
    }

    ((attribute, prev, value) => {
      switch (attribute) {
        case 'for':
          {
            // TODO: Need to revisit whether this is a good way to set autopoll.
            let targetElement = document.getElementById(value); // Enable autopoll if input source is unset.

            let flag = hasInputEventSource(value ? targetElement : this._sourceElement);

            if (!flag) {
              this._sourceElement.autopoll = true;
            }

            if (targetElement instanceof InputSource && targetElement._eventTarget) {
              this._sourceElement.setEventTarget(targetElement._eventTarget);

              this._sourceElement.className = targetElement.className;
              this._sourceElement.id = targetElement.id;
            } else {
              this._sourceElement.for = value;
            }

            let source = this._sourceElement;
            let map = this._mapElement.map;

            if (map) {
              this._inputContext.setInputMap(map).setInputSource(source).attach();

              this._inputContext.disabled = this._disabled;
            }
          }
          break;

        case 'src':
          this._mapElement.src = value;
          break;

        case 'disabled':
          {
            let source = this._sourceElement;
            let map = this._mapElement.map;

            if (source && map) {
              this._inputContext.disabled = this._disabled;
            }
          }
          break;
        // For debug info

        case 'id':
          this._sourceElement.id = value;
          break;

        case 'class':
          this._sourceElement.className = value;
          break;
      }
    })(attribute, prev, value);
  }

  get src() {
    return this._mapElement.src;
  }

  set src(value) {
    this._mapElement.src = value;
  }

  getInput(inputName) {
    return this._inputContext.getInput(inputName);
  }

  getInputValue(inputName) {
    return this._inputContext.getInputValue(inputName);
  }

  getInputChanged(inputName) {
    return this._inputContext.getInputChanged(inputName);
  }

}
window.customElements.define('input-context', InputContextElement);

export { AdapterManager, Axis, Button, Input, InputContext, InputContextElement, InputDevice, InputEventCode, InputKeyElement, InputMapElement, InputSource, InputSourceEventStage, InputType, KEY_STRING_DEVICE_SEPARATOR, Keyboard, Mouse, Synthetic, WILDCARD_DEVICE_MATCHER, WILDCARD_KEY_MATCHER, parseKeyString, stringifyDeviceKeyCodePair };
