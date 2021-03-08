'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

/**
 * An enum for input types.
 * 
 * @readonly
 * @enum {number}
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
 * @enum {number}
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
 * @property {string} deviceName
 * @property {string} keyCode
 * @property {InputEventCode} event
 * @property {InputType} type
 * @property {number} [value] If type is `key`, it is defined to be the input
 * value of the triggered event (usually this is 1). Otherwise, it is undefined.
 * @property {boolean} [control] If type is `key`, it is defined to be true if
 * any control key is down (false if up). Otherwise, it is undefined.
 * @property {boolean} [shift] If type is `key`, it is defined to be true if
 * any shift key is down (false if up). Otherwise, it is undefined.
 * @property {boolean} [alt] If type is `key`, it is defined to be true if any
 * alt key is down (false if up). Otherwise, it is undefined.
 * @property {number} [x] If type is `pos`, it is defined to be the x value
 * of the position event. Otherwise, it is undefined.
 * @property {number} [y] If type is `pos`, it is defined to be the y value
 * of the position event. Otherwise, it is undefined.
 * @property {number} [dx] If type is `pos` or `wheel`, it is defined to be
 * the change in the x value from the previous to the current position.
 * Otherwise, it is undefined.
 * @property {number} [dy] If type is `pos` or `wheel`, it is defined to be
 * the change in the y value from the previous to the current position.
 * Otherwise, it is undefined.
 * @property {number} [dz] If type is `wheel`, it is defined to be the change
 * in the z value from the previous to the current position. Otherwise, it
 * is undefined.
 * 
 * @callback InputDeviceListener
 * @param {InputEvent} e
 * @returns {boolean} Whether to consume the input after all other
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
   * @param {string} keyMatcher
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
   * @param {string} keyMatcher
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
   * @returns {boolean} Whether the input event should be consumed.
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
    if (!adapterOptions) return;

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

/**
 * A stateful input for axis input interfaces, such as mouse positions,
 * scrolling, joysticks, etc. The unscaled `value` is a floating point
 * in a 1-dimensional range of [-1, 1]. It also keeps track of the
 * accumulated delta since last poll with `delta`.
 */

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

/**
 * A stateful input for button input interfaces, such as keyboard
 * buttons, mouse buttons, etc. The unscaled `value` is either
 * 1 or 0. If truthy, this indicates that it is currently
 * being held down, and 0 indicates the opposite. It also keeps
 * track of this state as a boolean with `down` and `up`.
 */

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
 * @typedef {import('../device/InputDevice.js').InputDevice} InputDevice
 */

/**
 * @typedef {'update'|'poll'} InputSourceEventTypes
 * 
 * @typedef InputSourceInputEvent
 * @property {InputSourceEventStage} stage
 * @property {string} deviceName
 * @property {string} keyCode
 * @property {Axis|Button} input
 * 
 * @typedef InputSourcePollEvent
 * @property {number} now
 * 
 * @callback InputSourceEventListener
 * @param {InputSourceInputEvent|InputSourcePollEvent} e
 * 
 * @typedef KeyMapEntry
 * @property {number} refs The number of active references to this key.
 * @property {Input} input The input object.
 */

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
 * A class to model the current input state with buttons and axes for devices.
 */

class InputSourceState {
  constructor(deviceList = []) {
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
    /**
     * @type {Record<string, InputDevice>}
     */


    this.devices = deviceMap;
    /**
     * @private
     * @type {Record<string, Record<string, KeyMapEntry>>}
     */

    this.keyMap = keyMap;
    /** @private */

    this.listeners = {
      poll: [],
      update: []
    };
    /** @private */

    this._lastPollTime = -1;
    /** @private */

    this._autopoll = false;
    /** @private */

    this._animationFrameHandle = null;
  }
  /**
   * @returns {boolean} Whether in the last second this input source was polled.
   */


  get polling() {
    return performance.now() - this._lastPollTime < 1000;
  }
  /**
   * Destroys this source's devices and keys.
   */


  destroy() {
    this.clearKeys();

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
    for (const deviceName in this.keyMap) {
      let deviceKeyMap = this.keyMap[deviceName];

      for (const keyCode in deviceKeyMap) {
        let input = getKeyMapEntryInput(deviceKeyMap[keyCode]);
        input.poll();
        this.dispatchInputEvent(InputSourceEventStage.POLL, deviceName, keyCode, input);
      }
    }

    this.dispatchPollEvent(now);
    this._lastPollTime = now;
  }
  /**
   * Add listener to listen for event, in order by most
   * recently added. In other words, this listener will
   * be called BEFORE the previously added listener (if
   * there exists one) and so on.
   * 
   * @param {InputSourceEventTypes} event The name of the event.
   * @param {InputSourceEventListener} listener The listener callback.
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
   * @param {InputSourceEventTypes} event The name of the event.
   * @param {InputSourceEventListener} listener The listener callback.
   */


  removeEventListener(event, listener) {
    if (event in this.listeners) {
      let list = this.listeners[event];
      let i = list.indexOf(listener);
      list.splice(i, 1);
    }
  }
  /**
   * @param {InputSourceEventTypes} event The name of the event.
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
   * @param {InputSourceEventTypes} event The name of the event.
   * @param {InputSourceInputEvent|InputSourcePollEvent} eventOpts The event object to pass to listeners.
   */


  dispatchEvent(event, eventOpts) {
    for (let listener of this.listeners[event]) {
      listener(eventOpts);
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
    const deviceKeyMap = this.keyMap[deviceName];

    switch (e.type) {
      case InputType.KEY:
        {
          const keyCode = e.keyCode;
          let button = getKeyMapEntryInput(deviceKeyMap[keyCode]);

          if (button) {
            button.update(e.event === InputEventCode.DOWN);
            this.dispatchInputEvent(InputSourceEventStage.UPDATE, deviceName, keyCode, button);
            return true;
          }
        }
        break;

      case InputType.POS:
        {
          let xAxis = getKeyMapEntryInput(deviceKeyMap.PosX);

          if (xAxis) {
            xAxis.update(e.x, e.dx);
            this.dispatchInputEvent(InputSourceEventStage.UPDATE, deviceName, 'PosX', xAxis);
          }

          let yAxis = getKeyMapEntryInput(deviceKeyMap.PosY);

          if (yAxis) {
            yAxis.update(e.y, e.dy);
            this.dispatchInputEvent(InputSourceEventStage.UPDATE, deviceName, 'PosY', yAxis);
          }
        }
        break;

      case InputType.WHEEL:
        {
          let xAxis = getKeyMapEntryInput(deviceKeyMap.WheelX);

          if (xAxis) {
            xAxis.update(e.dx, e.dx);
            this.dispatchInputEvent(InputSourceEventStage.UPDATE, deviceName, 'WheelX', xAxis);
          }

          let yAxis = getKeyMapEntryInput(deviceKeyMap.WheelY);

          if (yAxis) {
            yAxis.update(e.dy, e.dy);
            this.dispatchInputEvent(InputSourceEventStage.UPDATE, deviceName, 'WheelY', yAxis);
          }

          let zAxis = getKeyMapEntryInput(deviceKeyMap.WheelZ);

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
  /**
   * If true, polling will be handled automatically through requestAnimationFrame().
   * 
   * @returns {boolean} Whether to automatically poll on animation frame.
   */


  get autopoll() {
    return this._autopoll;
  }
  /**
   * Register and enable the source input to listen to for the given device
   * and key code. Can be registered more than once to obtain active lease
   * on the input, which guarantees it will be unregistered the same number
   * of times before removal.
   * 
   * @param {string} deviceName The name of the device (case-sensitive).
   * @param {string} keyCode The key code for the given key in the device.
   */


  registerKey(deviceName, keyCode) {
    if (!(deviceName in this.devices)) {
      throw new Error(`Invalid device name - missing device with name '${deviceName}' in source.`);
    }

    let deviceKeyMap = this.keyMap[deviceName];

    if (keyCode in deviceKeyMap) {
      incrementKeyMapEntryRef(deviceKeyMap[keyCode]);
    } else {
      let device = this.devices[deviceName];
      let result;

      if (device.constructor.isAxis(keyCode)) {
        result = new Axis();
      } else if (device.constructor.isButton(keyCode)) {
        result = new Button();
      } else {
        throw new Error(`Unknown key code '${keyCode}' for device ${deviceName}.`);
      }

      deviceKeyMap[keyCode] = createKeyMapEntry(result);
    }

    return this;
  }
  /**
   * Remove and disable the registered source for the given device and key code.
   * 
   * @param {string} deviceName The name of the device (case-sensitive).
   * @param {string} keyCode The key code for the given key in the device.
   */


  unregisterKey(deviceName, keyCode) {
    let deviceKeyMap = this.keyMap[deviceName];

    if (deviceKeyMap) {
      let keyMapEntry = deviceKeyMap[keyCode];

      if (keyMapEntry) {
        decrementKeyMapEntryRef(keyMapEntry);

        if (keyMapEntry.refs <= 0) {
          delete deviceKeyMap[keyCode];
        }
      }
    }
  }
  /**
   * @param {string} deviceName The name of the device.
   * @param {string} keyCode The key code in the device.
   * @returns {boolean} Whether the device and key code has been registered.
   */


  hasKey(deviceName, keyCode) {
    return deviceName in this.keyMap && keyCode in this.keyMap[deviceName];
  }
  /**
   * Removes all registered inputs from all devices.
   */


  clearKeys() {
    for (let deviceName in this.devices) {
      let deviceKeyMap = this.keyMap[deviceName]; // Clean-up device key map.

      for (let keyCode in deviceKeyMap) {
        clearKeyMapEntryRef(deviceKeyMap[keyCode]);
      } // Actually clear it from future references.


      this.keyMap[deviceName] = {};
    }
  }
  /**
   * @returns {Button|Axis}
   */


  getInputByKey(deviceName, keyCode) {
    return getKeyMapEntryInput(this.keyMap[deviceName][keyCode]);
  }

}
/**
 * @param {Input} [input]
 * @returns {KeyMapEntry}
 */

function createKeyMapEntry(input = null) {
  return {
    refs: 1,
    input: input
  };
}
/**
 * @param {KeyMapEntry} keyMapEntry 
 */


function getKeyMapEntryInput(keyMapEntry) {
  return keyMapEntry ? keyMapEntry.input : null;
}
/**
 * @param {KeyMapEntry} keyMapEntry 
 */


function incrementKeyMapEntryRef(keyMapEntry) {
  keyMapEntry.refs += 1;
}
/**
 * @param {KeyMapEntry} keyMapEntry
 */


function decrementKeyMapEntryRef(keyMapEntry) {
  keyMapEntry.refs -= 1;
}
/**
 * @param {KeyMapEntry} keyMapEntry 
 */


function clearKeyMapEntryRef(keyMapEntry) {
  keyMapEntry.refs = 0;
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

/** This determines whether an element has an associated input event source. */

const INPUT_SOURCE_STATE_KEY = Symbol('inputSourceState');
/**
 * This serves as a layer of abstraction to get unique sources of input events by target elements. Getting
 * the input source for the same event target will return the same input source instance. This allows
 * easier management of input source references without worrying about duplicates.
 * 
 * If you do not want this feature but still want the events managed, use `InputSourceState` directly instead.
 */

class InputSource extends InputSourceState {
  /**
   * Get the associated input source for the given event target.
   * 
   * @param {EventTarget} eventTarget The target element to listen
   * for all input events.
   * @returns {InputSourceState} The input source for the given event target.
   */
  static for(eventTarget) {
    if (eventTarget) {
      return obtainInputSourceState(eventTarget);
    } else {
      throw new Error('Cannot get input source for null event target.');
    }
  }
  /**
   * Delete the associated input source for the given event target.
   * 
   * @param {EventTarget} eventTarget The target element being listened to.
   */


  static delete(eventTarget) {
    if (eventTarget) {
      releaseInputSourceState(eventTarget);
    }
  }
  /** @private */


  constructor() {
    super(); // NOTE: This is to enforce the for() and delete() structure.

    throw new Error('Cannot construct InputSource with new - use InputSourceState() instead.');
  }

}
/**
 * @param {EventTarget} eventTarget The target element to listen to.
 * @returns {boolean} Whether the event target has an associated input source.
 */

function hasAttachedInputSourceState(eventTarget) {
  return Object.prototype.hasOwnProperty.call(eventTarget, INPUT_SOURCE_STATE_KEY) && Object.getOwnPropertyDescriptor(eventTarget, INPUT_SOURCE_STATE_KEY).value;
}
/**
 * Obtain a lease to the associated input source for the event target element.
 * 
 * @param {EventTarget} eventTarget The target element to listen to.
 */


function obtainInputSourceState(eventTarget) {
  if (!hasAttachedInputSourceState(eventTarget)) {
    let state = new InputSourceState([new Keyboard(eventTarget), new Mouse(eventTarget)]);
    Object.defineProperty(eventTarget, INPUT_SOURCE_STATE_KEY, {
      value: {
        state: state,
        refs: 1
      },
      configurable: true
    });
    return state;
  } else {
    let descriptor = Object.getOwnPropertyDescriptor(eventTarget, INPUT_SOURCE_STATE_KEY);
    descriptor.value.refs += 1;
    return descriptor.value.state;
  }
}
/**
 * Release a single lease on the input source for the event target element.
 * 
 * @param {EventTarget} eventTarget The target element.
 */


function releaseInputSourceState(eventTarget) {
  if (hasAttachedInputSourceState(eventTarget)) {
    let descriptor = Object.getOwnPropertyDescriptor(eventTarget, INPUT_SOURCE_STATE_KEY);
    descriptor.value.refs -= 1;

    if (descriptor.value.refs <= 0) {
      let state = descriptor.value.state;
      delete eventTarget[INPUT_SOURCE_STATE_KEY];
      state.destroy();
    }
  }
}

/**
 * @typedef {import('./source/InputSourceState.js').InputSourceInputEvent} InputSourceInputEvent
 * @typedef {import('./source/InputSourceState.js').InputSourcePollEvent} InputSourcePollEvent
 */

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
          prevInputSource.unregisterKey(deviceName, keyCode);
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
          inputSource.registerKey(deviceName, keyCode);
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
   * @param {InputSourceInputEvent} e
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
   * @param {InputSourcePollEvent} e
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
  if (!(inputSourceOrEventTarget instanceof InputSourceState)) {
    return InputSource.for(inputSourceOrEventTarget);
  } else {
    return inputSourceOrEventTarget;
  }
}

var INNER_HTML = "<div>\r\n    <label id=\"title\">\r\n        input-source\r\n    </label>\r\n    <span>|</span>\r\n    <p>\r\n        <label for=\"poll\">poll</label>\r\n        <output id=\"poll\"></output>\r\n    </p>\r\n    <p>\r\n        <label for=\"focus\">focus</label>\r\n        <output id=\"focus\"></output>\r\n    </p>\r\n</div>\r\n";

var INNER_STYLE = ":host{display:inline-block}div{font-family:monospace;color:#666;outline:1px solid #666;padding:4px}p{display:inline;margin:0;padding:0}#focus:empty:after,#poll:empty:after{content:\"✗\";color:red}";

/**
 * @typedef {import('./InputSourceState.js').InputSourceState} InputSourceState
 */

/** Poll status check interval in milliseconds. */

const INTERVAL_DURATION = 1000;
class InputSourceElement extends HTMLElement {
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

  static get properties() {
    return {
      for: String,

      /**
       * Whether to automatically poll the state on each frame. This is a shared
       * state with all input sources that have the same event target. In other
       * words, all input sources with the same event target must have the
       * same autopoll value, otherwise behavior is undefined.
       * 
       * Implementation-wise, the closest and most recent autopoll value is used.
       * This follows the standard HTML loading order.
       */
      autopoll: Boolean
    };
  }

  /**
               * Whether to automatically poll the state on each frame. This is a shared
               * state with all input sources that have the same event target. In other
               * words, all input sources with the same event target must have the
               * same autopoll value, otherwise behavior is undefined.
               * 
               * Implementation-wise, the closest and most recent autopoll value is used.
               * This follows the standard HTML loading order.
               */
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

  constructor() {
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
    /**
     * @private
     * @type {EventTarget}
     */

    this._eventTarget = null;
    /**
     * @private
     * @type {InputSource}
     */

    this._sourceState = null;
    /** @private */

    this.onSourcePoll = this.onSourcePoll.bind(this);
    /** @private */

    this.onSourceInput = this.onSourceInput.bind(this);
    /** @private */

    this.onTargetFocus = this.onTargetFocus.bind(this);
    /** @private */

    this.onTargetBlur = this.onTargetBlur.bind(this);
    /** @private */

    this.onPollStatusCheck = this.onPollStatusCheck.bind(this);
    /** @private */

    this._intervalHandle = 0;
  }

  get eventTarget() {
    return this._eventTarget;
  }

  get source() {
    return this._sourceState;
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

    if (!this.hasAttribute('for') && !this._eventTarget) ;

    this._intervalHandle = setInterval(this.onPollStatusCheck, INTERVAL_DURATION);
  }

  /** @override */
  disconnectedCallback() {
    this.clearEventTarget();
    clearInterval(this._intervalHandle);
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
          {
            let target;
            let name;

            if (value) {
              target = document.getElementById(value);
              name = `${target.tagName.toLowerCase()}#${value}`;
            } else {
              target = this;
              name = 'input-source';
            }

            this.setEventTarget(value ? document.getElementById(value) : this); // For debug info

            this._titleElement.innerHTML = `for(${name})`;
          }
          break;

        case 'autopoll':
          {
            if (this._sourceState) {
              this._sourceState.autopoll = this._autopoll;
            }
          }
          break;
      }
    })(attribute, prev, value);
  }
  /**
   * Set event target to listen for input events.
   * 
   * @param {EventTarget} [eventTarget] The event target to listen for input events. If
   * falsey, no target will be listened to.
   */


  setEventTarget(eventTarget = undefined) {
    this.clearEventTarget();

    if (eventTarget) {
      let sourceState = InputSource.for(eventTarget);
      this._sourceState = sourceState;
      this._eventTarget = eventTarget;
      sourceState.autopoll = this.autopoll;
      sourceState.addEventListener('poll', this.onSourcePoll);
      sourceState.addEventListener('input', this.onSourceInput);
      eventTarget.addEventListener('focus', this.onTargetFocus);
      eventTarget.addEventListener('blur', this.onTargetBlur);
    }

    return this;
  }
  /**
   * Stop listening to the current target for input events.
   */


  clearEventTarget() {
    if (this._eventTarget) {
      let eventTarget = this._eventTarget;
      let sourceState = this._sourceState;
      this._eventTarget = null;
      this._sourceState = null;

      if (eventTarget) {
        eventTarget.removeEventListener('focus', this.onTargetFocus);
        eventTarget.removeEventListener('blur', this.onTargetBlur); // Event source also exists (and therefore should be removed) if event target was setup.

        sourceState.removeEventListener('poll', this.onSourcePoll);
        sourceState.removeEventListener('input', this.onSourceInput); // Clean up event source if no longer used.

        InputSource.delete(eventTarget);
      }
    }
  }
  /**
   * Poll input state from devices.
   * 
   * @param {number} now The current time in milliseconds.
   */


  poll(now) {
    this._sourceState.poll(now);
  }
  /** @private */


  onPollStatusCheck() {
    if (this._sourceState && this._sourceState.polling) {
      this._pollElement.innerHTML = '✓';
    } else {
      this._pollElement.innerHTML = '';
    }
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
    this.dispatchEvent(new CustomEvent('poll', {
      composed: true,
      bubbles: false,
      detail: {
        now
      }
    }));
  }
  /** @private */


  onTargetFocus() {
    this._focusElement.innerHTML = '✓';
  }
  /** @private */


  onTargetBlur() {
    this._focusElement.innerHTML = '';
  }

  static get observedAttributes() {
    return ["oninput", "onpoll", "for", "autopoll"];
  }

}
window.customElements.define('input-source', InputSourceElement);

var INNER_HTML$1 = "<kbd>\r\n    <span id=\"key\"><slot></slot></span>\r\n    <span id=\"value\" class=\"hidden\"></span>\r\n</kbd>\r\n";

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

var INNER_HTML$2 = "<table>\r\n    <thead>\r\n        <tr class=\"tableHeader\">\r\n            <th colspan=4>\r\n                <slot></slot>\r\n            </th>\r\n        </tr>\r\n        <tr class=\"colHeader\">\r\n            <th>name</th>\r\n            <th>key</th>\r\n            <th>mod</th>\r\n            <th>value</th>\r\n        </tr>\r\n    </thead>\r\n    <tbody>\r\n    </tbody>\r\n</table>\r\n";

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
    return ["onload", 'src'];
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

var INNER_HTML$3 = "<input-map>\r\n    <slot></slot>\r\n    <input-source></input-source>\r\n</input-map>\r\n";

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
    return this._sourceElement.source;
  }

  get map() {
    return this._mapElement.map;
  }

  onInputMapLoad() {
    let source = this._sourceElement.source;
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
            let targetElement = document.getElementById(value);

            if (targetElement instanceof InputSource && targetElement._eventTarget) {
              this._sourceElement.setEventTarget(targetElement._eventTarget);

              this._sourceElement.className = targetElement.className;
              this._sourceElement.id = targetElement.id;
            } else {
              this._sourceElement.for = value;
            }

            let source = this._sourceElement.source;
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
            let source = this._sourceElement.source;
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

var INNER_HTML$4 = "<input-map>\r\n    <slot></slot>\r\n    <input-source></input-source>\r\n</input-map>\r\n";

var INNER_STYLE$4 = ":host{display:inline-block}";

/**
 * @typedef {import('./source/InputSourceState.js').InputSourceInputEvent} InputSourceInputEvent
 * @typedef {import('./source/InputSourceState.js').InputSourcePollEvent} InputSourcePollEvent
 */

/**
 * @typedef {string} InputEvent
 * @typedef {string} InputKeyString
 * 
 * @typedef InputKeyOption
 * @property {InputKeyString} key
 * @property {InputEvent} [event]
 * @property {number} [scale]
 * 
 * @typedef {InputKeyString|InputKeyOption} InputMappingEntryValue
 * @typedef {InputMappingEntryValue|Array<InputMappingEntryValue>} InputMappingEntry
 * @typedef {Record<string, InputMappingEntry>} InputMapping
 * 
 * @typedef {Record<string, Synthetic>} SyntheticMap 
 */

/**
 * @typedef {'change'|'attach'|'detach'} InputContextEventTypes
 * 
 * @typedef InputContextChangeEvent
 * @typedef InputContextAttachEvent
 * @typedef InputContextDetachEvent
 * 
 * @callback InputContextEventListener
 * @param {InputContextChangeEvent|InputContextAttachEvent|InputContextDetachEvent} e
 */

class InputContext$1 {
  /**
   * Constructs a disabled InputContext.
   */
  constructor() {
    /** @private */
    this._source = null;
    /** @private */

    this._mapping = null;
    /** @private */

    this._disabled = true;
    /** @private */

    this._ignoreInputs = this._disabled;
    /** @private */

    this.adapters = new AdapterManager();
    /**
     * @private
     * @type {SyntheticMap}
     */

    this.inputs = {};
    /** @private */

    this.listeners = {
      change: [],
      attach: [],
      detach: []
    };
    /** @private */

    this.onSourceInput = this.onSourceInput.bind(this);
    /** @private */

    this.onSourcePoll = this.onSourcePoll.bind(this);
  }

  get source() {
    return this._source;
  }

  get mapping() {
    return this._mapping;
  }

  get disabled() {
    return this._disabled;
  }

  set disabled(value) {
    this.toggle(!value);
  }
  /**
   * @param {InputMapping} inputMapping
   * @returns {InputContext}
   */


  setInputMapping(inputMapping) {
    const prevDisabled = this.disabled;
    this.disabled = true;
    let prevSource = this.source;
    let prevInputs = this.inputs; // Clean up previous state.

    if (prevSource) {
      unregisterInputKeys(prevSource, prevInputs);
    }

    this.adapters.clear(); // Set up next state.

    let nextSource = this.source;
    let nextInputs = {};

    if (inputMapping) {
      for (let inputName in inputMapping) {
        let adapterOptions = inputMapping[inputName]; // NOTE: Preserve synthetics across restarts.

        let synthetic = prevInputs[inputName] || new Synthetic();
        synthetic.hydrate(adapterOptions);
        let syntheticAdapters = synthetic.adapters;
        this.adapters.add(syntheticAdapters);
        nextInputs[inputName] = synthetic;
      }

      if (nextSource) {
        registerInputKeys(nextSource, nextInputs);
      }
    }

    this.inputs = nextInputs;
    this._mapping = inputMapping;
    this.dispatchChangeEvent(); // Force disable if missing required components, otherwise return to previous operating state.

    this.disabled = this.source && this.inputs ? prevDisabled : true;
    return this;
  }

  attach(inputSource) {
    if (this.source) {
      this.detach();
    }

    if (!inputSource) {
      throw new Error('Missing input source to attach context.');
    }

    registerInputKeys(inputSource, this.inputs);
    inputSource.addEventListener('poll', this.onSourcePoll);
    inputSource.addEventListener('input', this.onSourceInput);
    this._source = inputSource;
    this.toggle(true);
    this.dispatchAttachEvent();
    return this;
  }

  detach() {
    let prevSource = this.source;
    let prevInputs = this.inputs;

    if (prevSource) {
      this.toggle(false);
      prevSource.removeEventListener('poll', this.onSourcePoll);
      prevSource.removeEventListener('input', this.onSourceInput);

      if (prevInputs) {
        unregisterInputKeys(prevSource, prevInputs);
      }

      this._source = null;
      this.dispatchDetachEvent();
    }

    return this;
  }
  /**
   * Add listener to listen for event, in order by most
   * recently added. In other words, this listener will
   * be called BEFORE the previously added listener (if
   * there exists one) and so on.
   * 
   * @param {InputContextEventTypes} event The name of the event.
   * @param {InputContextEventListener} listener The listener callback.
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
   * @param {InputContextEventTypes} event The name of the event.
   * @param {InputContextEventListener} listener The listener callback.
   */


  removeEventListener(event, listener) {
    if (event in this.listeners) {
      let list = this.listeners[event];
      let i = list.indexOf(listener);
      list.splice(i, 1);
    }
  }
  /**
   * @param {InputContextEventTypes} event The name of the event.
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
   * @param {InputSourceEventTypes} event The name of the event.
   * @param {InputSourceInputEvent|InputSourcePollEvent} eventOpts The event object to pass to listeners.
   */


  dispatchEvent(event, eventOpts) {
    for (let listener of this.listeners[event]) {
      listener(eventOpts);
    }
  }
  /** @private */


  dispatchChangeEvent() {
    this.dispatchEvent('change', {});
  }
  /** @private */


  dispatchAttachEvent() {
    this.dispatchEvent('attach', {});
  }
  /** @private */


  dispatchDetachEvent() {
    this.dispatchEvent('detach', {});
  }
  /**
   * @private
   * @param {InputSourceInputEvent} e
   */


  onSourceInput(e) {
    if (!e.consumed && !this._ignoreInputs) {
      const {
        stage,
        deviceName,
        keyCode,
        input
      } = e;

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
   * @param {InputSourcePollEvent} e
   */


  onSourcePoll(e) {
    if (this._ignoreInputs !== this.disabled) {
      this._ignoreInputs = this.disabled;
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
    let result = !force;

    if (!result) {
      if (!this.source) {
        throw new Error('Input source must be set before enabling input context.');
      }
    }

    this._disabled = result;
    return this;
  }
  /**
   * @param {string} inputName The name of the input.
   * @returns {boolean} Whether the input exists for the given name.
   */


  hasInput(inputName) {
    return inputName in this.inputs && this.inputs[inputName].adapters.length > 0;
  }
  /**
   * Get the synthetic input object by name.
   * 
   * @param {string} inputName The name of the input.
   * @returns {Synthetic} The synthetic input for the given input name.
   */


  getInput(inputName) {
    if (inputName in this.inputs) {
      return this.inputs[inputName];
    } else {
      let synthetic = new Synthetic();
      this.inputs[inputName] = synthetic;
      this._mapping[inputName] = '';
      this.dispatchChangeEvent();
      return synthetic;
    }
  }
  /**
   * Get the current value of the input by name.
   * 
   * @param {String} inputName The name of the input.
   * @returns {number} The input value.
   */


  getInputState(inputName) {
    if (inputName in this.inputs) {
      return this.inputs[inputName].value;
    } else {
      return 0;
    }
  }
  /**
   * Get the change in value of the input by name since last poll.
   * 
   * @param {String} inputName The name of the input.
   * @returns {number} The input value.
   */


  getInputChanged(inputName) {
    if (inputName in this.inputs) {
      let input = this.inputs[inputName];
      return input.value - input.prev;
    } else {
      return 0;
    }
  }

}

function registerInputKeys(inputSource, inputs) {
  for (let inputName in inputs) {
    let {
      adapters
    } = inputs[inputName];

    for (let adapter of adapters) {
      const {
        deviceName,
        keyCode
      } = adapter;
      inputSource.registerKey(deviceName, keyCode);
    }
  }
}

function unregisterInputKeys(inputSource, inputs) {
  for (let inputName in inputs) {
    let {
      adapters
    } = inputs[inputName];

    for (let adapter of adapters) {
      const {
        deviceName,
        keyCode
      } = adapter;
      inputSource.unregisterKey(deviceName, keyCode);
    }
  }
}

function upgradeProperty$2(element, propertyName) {
  if (Object.prototype.hasOwnProperty.call(element, propertyName)) {
    let value = element[propertyName];
    delete element[propertyName];
    element[propertyName] = value;
  }
}

class InputPort extends HTMLElement {
  /** Generated by cuttle.js */
  static get [Symbol.for("cuttleTemplate")]() {
    let t = document.createElement("template");
    t.innerHTML = INNER_HTML$4;
    Object.defineProperty(this, Symbol.for("cuttleTemplate"), {
      value: t
    });
    return t;
  }

  /** Generated by cuttle.js */
  static get [Symbol.for("cuttleStyle")]() {
    let s = document.createElement("style");
    s.innerHTML = INNER_STYLE$4;
    Object.defineProperty(this, Symbol.for("cuttleStyle"), {
      value: s
    });
    return s;
  }

  static get properties() {
    // src: A custom type,
    return {
      for: String,
      autopoll: Boolean,
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

  static get observedAttributes() {
    return ["for", "autopoll", "disabled", 'src'];
  }
  /**
   * @param {InputContext} [inputContext]
   */


  constructor(inputContext = undefined) {
    super();
    this.attachShadow({
      mode: 'open'
    });
    this.shadowRoot.appendChild(this.constructor[Symbol.for("cuttleTemplate")].content.cloneNode(true));
    this.shadowRoot.appendChild(this.constructor[Symbol.for("cuttleStyle")].cloneNode(true));
    /** @private */

    this._src = '';
    /** @private */

    this._context = inputContext || new InputContext$1();
    /** @private */

    this._mapElement = this.shadowRoot.querySelector('input-map');
    /** @private */

    this._sourceElement = this.shadowRoot.querySelector('input-source');
    /** @private */

    this.onSourcePoll = this.onSourcePoll.bind(this);
    /** @private */

    this.onContextChange = this.onContextChange.bind(this);

    this._sourceElement.addEventListener('poll', this.onSourcePoll);

    this._context.addEventListener('change', this.onContextChange);
  }

  get context() {
    return this._context;
  }

  get source() {
    return this._sourceElement.source;
  }

  get mapping() {
    return this._context.mapping;
  }

  get src() {
    return this._src;
  }

  set src(value) {
    this.setAttribute('src', typeof value === 'string' ? value : JSON.stringify(value));
  }
  /** @override */


  connectedCallback() {
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

    if (Object.prototype.hasOwnProperty.call(this, "disabled")) {
      let value = this.disabled;
      delete this.disabled;
      this.disabled = value;
    }

    upgradeProperty$2(this, 'src');
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
            if (this._sourceElement instanceof InputSourceElement) {
              let target = document.getElementById(value);

              if (target instanceof InputSourceElement) {
                target = target.eventTarget;
              }

              this.updateSource(target);
            }
          }
          break;

        case 'src':
          if (this._src !== value) {
            this._src = value;

            if (value.trim().startsWith('{')) {
              let jsonData = JSON.parse(value);
              this.updateMapping(jsonData);
            } else {
              fetch(value).then(fileBlob => fileBlob.json()).then(jsonData => this.updateMapping(jsonData));
            }
          }

          break;

        case 'autopoll':
          this._sourceElement.autopoll = this._autopoll;
          break;

        case 'disabled':
          this.updateDisabled(this._disabled);
          break;
      }
    })(attribute, prev, value);
  }
  /** @private */


  updateSource(eventTarget) {
    this._sourceElement.setEventTarget(eventTarget);

    this.updateAttachment(this._context);
    this.updateDisabled(this._disabled);
  }
  /** @private */


  updateMapping(inputMapping) {
    this._context.setInputMapping(inputMapping);

    this._mapElement.src = inputMapping;
    this.updateAttachment(this._context);
    this.updateDisabled(this._disabled);
  }
  /** @private */


  updateDisabled(disabled) {
    if (this._context.source) {
      this._context.disabled = disabled;
    }
  }
  /** @private */


  updateAttachment(inputContext) {
    let source = this._sourceElement.source;
    let mapping = this._mapElement.map;

    if (mapping) {
      inputContext.setInputMapping(mapping);
    }

    if (source) {
      inputContext.attach(source);
    } else {
      inputContext.detach();
    }
  }
  /** @private */


  onSourcePoll() {
    for (let [inputName, entries] of Object.entries(this._mapElement.mapElements)) {
      let value = this._context.getInputState(inputName);

      let primary = entries[0];
      let outputElement = primary.querySelector('output');
      outputElement.innerText = Number(value).toFixed(2);
    }
  }
  /** @private */


  onContextChange() {
    this._mapElement.src = this._context.mapping;
  }

}
window.customElements.define('input-port', InputPort);

exports.AdapterManager = AdapterManager;
exports.InputContext = InputContext;
exports.InputContextElement = InputContextElement;
exports.InputDevice = InputDevice;
exports.InputEventCode = InputEventCode;
exports.InputKeyElement = InputKeyElement;
exports.InputMapElement = InputMapElement;
exports.InputPort = InputPort;
exports.InputSource = InputSource;
exports.InputSourceElement = InputSourceElement;
exports.InputSourceEventStage = InputSourceEventStage;
exports.InputSourceState = InputSourceState;
exports.InputType = InputType;
exports.Keyboard = Keyboard;
exports.Mouse = Mouse;
exports.WILDCARD_DEVICE_MATCHER = WILDCARD_DEVICE_MATCHER;
exports.WILDCARD_KEY_MATCHER = WILDCARD_KEY_MATCHER;
