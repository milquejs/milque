'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

/**
 * @typedef {number} BindingIndex
 *
 * @typedef BindingOptions
 * @property {boolean} inverted
 *
 * @typedef InputReadOnly
 * @property {number} value
 * @property {boolean} polling
 */

class InputBase {
  get polling() {
    let dt = performance.now() - this._lastPollingTime;
    return dt < 1_000;
  }

  /** @abstract */
  get value() {
    return 0;
  }

  /** @protected */
  get size() {
    return this._size;
  }

  /**
   * @abstract
   * @param {number} size The initial binding state size.
   */
  constructor(size) {
    /** @private */
    this._size = size;
    /** @private */
    this._lastPollingTime = Number.MIN_SAFE_INTEGER;
  }

  /**
   * Called to internally resize to accomodate more/less
   * binding states.
   *
   * @protected
   * @param {number} newSize
   */
  resize(newSize) {
    this._size = newSize;
  }

  /**
   * @abstract
   * @param {BindingIndex} code
   * @returns {number}
   */
  // eslint-disable-next-line no-unused-vars
  getState(code) {
    throw new Error('Missing implementation.');
  }

  /**
   * @abstract
   * @param {BindingIndex} code
   * @param {number} value
   * @param {number} delta
   */
  // eslint-disable-next-line no-unused-vars
  onUpdate(code, value, delta) {
    throw new Error('Missing implementation.');
  }

  /**
   * @abstract
   * @param {BindingIndex} code
   * @param {number} value
   */
  // eslint-disable-next-line no-unused-vars
  onStatus(code, value) {
    throw new Error('Missing implementation.');
  }

  /**
   * Called to poll all bound states.
   *
   * @param {number} now
   */
  onPoll(now) {
    this._lastPollingTime = now;
  }

  /**
   * Called to bind a state to the given binding code.
   *
   * @param {BindingIndex} code
   * @param {BindingOptions} [opts]
   */
  // eslint-disable-next-line no-unused-vars
  onBind(code, opts = {}) {
    if (code >= this._size) {
      this.resize(code + 1);
    }
  }

  /**
   * Called to unbind all states.
   */
  onUnbind() {
    this.resize(0);
  }
}

/**
 * @typedef {import('./InputBase.js').BindingIndex} BindingIndex The binding index
 * @typedef {import('./InputBase.js').BindingOptions} BindingOptions The binding options
 *
 * @typedef AxisBindingState
 * @property {number} value
 * @property {number} delta
 * @property {boolean} inverted
 *
 * @typedef AxisReadOnly
 * @property {number} value
 * @property {number} delta
 * @property {boolean} polling
 */

class Axis extends InputBase {
  /** @returns {AxisBindingState} */
  static createAxisBindingState() {
    return {
      value: 0,
      delta: 0,
      inverted: false,
    };
  }

  /** @returns {number} */
  get delta() {
    return this._delta;
  }

  /**
   * @override
   * @returns {number}
   */
  get value() {
    return this._value;
  }

  /**
   * @param {number} [size]
   */
  constructor(size = 0) {
    super(size);
    let state = new Array();
    for (let i = 0; i < size; ++i) {
      state.push(this.constructor.createAxisBindingState());
    }
    /**
     * @private
     * @type {Array<AxisBindingState>}
     */
    this._state = state;
    /** @private */
    this._value = 0;
    /** @private */
    this._delta = 0;
  }

  /**
   * @override
   * @protected
   */
  resize(newSize) {
    let oldState = this._state;
    let oldSize = oldState.length;
    let newState;
    if (newSize <= oldSize) {
      newState = oldState.slice(0, newSize);
    } else {
      newState = oldState;
      // Fill with new states
      for (let i = oldSize; i < newSize; ++i) {
        newState.push(this.constructor.createAxisBindingState());
      }
    }
    this._state = newState;
    super.resize(newSize);
  }

  /**
   * @override
   * @param {BindingIndex} code
   * @returns {number}
   */
  getState(code) {
    return this._state[code].value;
  }

  /**
   * @override
   * @param {number} now
   */
  onPoll(now) {
    let state = this._state;
    let accumulatedValue = 0;
    let accumulatedDelta = 0;
    const len = state.length;
    for (let i = 0; i < len; ++i) {
      let value = state[i];
      accumulatedValue += value.value * (value.inverted ? -1 : 1);
      accumulatedDelta += value.delta;
      state[i].delta = 0;
    }
    this._value = accumulatedValue;
    this._delta = accumulatedDelta;
    super.onPoll(now);
  }

  /**
   * @override
   * @param {BindingIndex} code
   * @param {number} value
   * @param {number} delta
   */
  onUpdate(code, value, delta) {
    if (typeof value === 'undefined') {
      this.onAxisChange(code, delta);
    } else {
      this.onAxisMove(code, value, delta);
    }
  }

  /**
   * @override
   * @param {BindingIndex} code
   * @param {number} value
   */
  onStatus(code, value) {
    this.onAxisStatus(code, value);
  }

  /**
   * @override
   * @param {BindingIndex} code
   * @param {BindingOptions} [opts]
   */
  onBind(code, opts = {}) {
    super.onBind(code, opts);
    const { inverted = false } = opts;
    let state = this._state;
    state[code].inverted = inverted;
  }

  /**
   * @protected
   * @param {BindingIndex} code
   * @param {number} x
   * @param {number} dx
   */
  onAxisMove(code, x, dx) {
    let state = this._state[code];
    state.value = x;
    state.delta += dx;
  }

  /**
   * @protected
   * @param {BindingIndex} code
   * @param {number} dx
   */
  onAxisChange(code, dx) {
    let state = this._state[code];
    state.value += dx;
    state.delta += dx;
  }

  /**
   * @protected
   * @param {BindingIndex} code
   * @param {number} x
   */
  onAxisStatus(code, x) {
    let state = this._state[code];
    let prev = state.value;
    state.value = x;
    state.delta = x - prev;
  }
}

/**
 * @typedef {import('./InputBase.js').BindingIndex} BindingIndex
 * @typedef {import('./InputBase.js').BindingOptions} BindingOptions
 *
 * @typedef ButtonReadOnly
 * @property {number} value
 * @property {boolean} pressed
 * @property {boolean} repeated
 * @property {boolean} released
 * @property {boolean} down
 * @property {boolean} polling
 */

const CLEAR_POLL_BITS = 0b1111_0001;
const CLEAR_DOWN_STATE_BITS = 0b1111_1110;
const CLEAR_INVERTED_MODIFIER_BITS = 0b1110_1111;

const DOWN_STATE_BIT = 0b0000_0001;
const PRESSED_STATE_BIT = 0b0000_0010;
const REPEATED_STATE_BIT = 0b0000_0100;
const RELEASED_STATE_BIT = 0b0000_1000;
const INVERTED_MODIFIER_BIT = 0b0001_0000;

class Button extends InputBase {
  /** @returns {boolean} */
  get pressed() {
    return this._pressed;
  }

  /** @returns {boolean} */
  get repeated() {
    return this._repeated;
  }

  /** @returns {boolean} */
  get released() {
    return this._released;
  }

  /** @returns {boolean} */
  get down() {
    return this._down;
  }

  /**
   * @override
   * @returns {number}
   */
  get value() {
    return this._value;
  }

  /**
   * @param {number} [size]
   */
  constructor(size = 0) {
    super(size);
    /** @private */
    this._state = new Uint8Array(size);
    /** @private */
    this._value = 0;
    /** @private */
    this._down = false;
    /** @private */
    this._pressed = false;
    /** @private */
    this._repeated = false;
    /** @private */
    this._released = false;
  }

  /**
   * @override
   * @protected
   */
  resize(newSize) {
    let oldState = this._state;
    let oldSize = oldState.length;
    let newState;
    if (newSize <= oldSize) {
      newState = oldState.slice(0, newSize);
    } else {
      newState = new Uint8Array(newSize);
      newState.set(oldState);
    }
    this._state = newState;
    super.resize(newSize);
  }

  /**
   * @override
   * @param {BindingIndex} code
   * @returns {number}
   */
  getState(code) {
    let state = this._state[code];
    let modifier = state & INVERTED_MODIFIER_BIT ? -1 : 1;
    let value = state & DOWN_STATE_BIT ? 1 : 0;
    return value * modifier;
  }

  /**
   * @override
   * @param {number} now
   */
  onPoll(now) {
    let state = this._state;
    let result = 0;
    let down = 0;
    let pressed = 0;
    let repeated = 0;
    let released = 0;
    const len = state.length;
    for (let i = 0; i < len; ++i) {
      let value = state[i];
      let v = value & DOWN_STATE_BIT;
      let m = value & INVERTED_MODIFIER_BIT;
      down |= v;
      pressed |= value & PRESSED_STATE_BIT;
      repeated |= value & REPEATED_STATE_BIT;
      released |= value & RELEASED_STATE_BIT;
      result += (v ? 1 : 0) * (m ? -1 : 1);
      state[i] &= CLEAR_POLL_BITS;
    }
    this._value = result;
    this._down = down !== 0;
    this._pressed = pressed !== 0;
    this._repeated = repeated !== 0;
    this._released = released !== 0;
    super.onPoll(now);
  }

  /**
   * @override
   * @param {BindingIndex} code
   * @param {number} value
   * @param {number} delta
   */
  onUpdate(code, value, delta) {
    if (delta > 0) {
      this.onButtonPressed(code);
    } else {
      this.onButtonReleased(code);
    }
  }

  /**
   * @override
   * @param {BindingIndex} code
   * @param {number} value
   */
  onStatus(code, value) {
    this.onButtonStatus(code, value !== 0);
  }

  /**
   * @override
   * @param {BindingIndex} code
   * @param {BindingOptions} [opts]
   */
  onBind(code, opts = {}) {
    super.onBind(code, opts);
    const { inverted = false } = opts;
    let state = this._state;
    if (inverted) {
      state[code] |= INVERTED_MODIFIER_BIT;
    } else {
      state[code] &= CLEAR_INVERTED_MODIFIER_BITS;
    }
  }

  /**
   * @protected
   * @param {BindingIndex} code
   */
  onButtonPressed(code) {
    let state = this._state;
    let bits = state[code];
    if (!(bits & DOWN_STATE_BIT)) {
      bits |= PRESSED_STATE_BIT;
      bits |= DOWN_STATE_BIT;
    }
    bits |= REPEATED_STATE_BIT;
    state[code] = bits;
  }

  /**
   * @protected
   * @param {BindingIndex} code
   */
  onButtonReleased(code) {
    let state = this._state;
    let bits = state[code];
    if (bits & DOWN_STATE_BIT) {
      bits |= RELEASED_STATE_BIT;
      bits &= CLEAR_DOWN_STATE_BITS;
    }
    state[code] = bits;
  }

  /**
   * @protected
   * @param {BindingIndex} code
   * @param {boolean} isDown
   */
  onButtonStatus(code, isDown) {
    let state = this._state;
    let bits = state[code];
    let wasDown = Boolean(bits & DOWN_STATE_BIT);
    if (isDown) {
      bits |= DOWN_STATE_BIT;
    } else {
      bits &= CLEAR_DOWN_STATE_BITS;
    }
    if (wasDown && !isDown) {
      bits |= RELEASED_STATE_BIT;
    }
    if (!wasDown && isDown) {
      bits |= PRESSED_STATE_BIT;
      bits |= REPEATED_STATE_BIT;
    }
    state[code] = bits;
  }
}

class KeyCode$1 {
  /**
   * @param {string} string
   * @returns {KeyCode}
   */
  static parse(string) {
    string = string.trim();
    let i = string.indexOf('.');
    if (i < 0) {
      throw new Error('Missing device separator for key code.');
    }
    let device = string.substring(0, i);
    if (device.length < 0) {
      throw new Error('Missing device for key code.');
    }
    let key = string.substring(i + 1);
    if (key.length < 0) {
      throw new Error('Missing code for key code.');
    }
    return new KeyCode$1(device, key);
  }

  /**
   * @param {string} device
   * @param {string} code
   */
  constructor(device, code) {
    this.device = device;
    this.code = code;
  }

  /** @override */
  toString() {
    return `${this.device}.${this.code}`;
  }
}

function from$1(device, code) {
  return new KeyCode$1(device, code);
}

class InputBinding {
  /** @returns {boolean} */
  get polling() {
    if (!this.ref) {
      return false;
    }
    return this.ref.polling;
  }

  /** @returns {number} */
  get value() {
    if (!this.ref || this.disabled) {
      return 0;
    }
    return this.ref.value;
  }

  /**
   * @param {string} name
   */
  constructor(name) {
    /** @protected */
    this.name = name;

    /** @protected */
    this.ref = null;

    /** @protected */
    this.disabled = false;
  }

  /**
   * @abstract
   * @param {import('../InputContext.js').InputContext} inputContext
   */
  register(inputContext) {
    throw new Error('Unsupported operation.');
  }

  disable(force = true) {
    this.disabled = force;
    return this;
  }

  /**
   * @param {number} code
   * @returns {number}
   */
  getState(code) {
    if (!this.ref || this.disabled) {
      return 0;
    }
    return this.ref.getState(code);
  }
}

class KeyCode {
  /**
   * @param {string} string
   * @returns {KeyCode}
   */
  static parse(string) {
    string = string.trim();
    let i = string.indexOf('.');
    if (i < 0) {
      throw new Error('Missing device separator for key code.');
    }
    let device = string.substring(0, i);
    if (device.length < 0) {
      throw new Error('Missing device for key code.');
    }
    let key = string.substring(i + 1);
    if (key.length < 0) {
      throw new Error('Missing code for key code.');
    }
    return new KeyCode(device, key);
  }

  /**
   * @param {string} device
   * @param {string} code
   */
  constructor(device, code) {
    this.device = device;
    this.code = code;
  }

  /** @override */
  toString() {
    return `${this.device}.${this.code}`;
  }
}

function from(device, code) {
  return new KeyCode(device, code);
}

function isKeyCode(object) {
  return 'device' in object && 'code' in object;
}

const KEYBOARD = 'Keyboard';
const MOUSE = 'Mouse';

const KEY_A = new KeyCode(KEYBOARD, 'KeyA');
const KEY_B = new KeyCode(KEYBOARD, 'KeyB');
const KEY_C = new KeyCode(KEYBOARD, 'KeyC');
const KEY_D = new KeyCode(KEYBOARD, 'KeyD');
const KEY_E = new KeyCode(KEYBOARD, 'KeyE');
const KEY_F = new KeyCode(KEYBOARD, 'KeyF');
const KEY_G = new KeyCode(KEYBOARD, 'KeyG');
const KEY_H = new KeyCode(KEYBOARD, 'KeyH');
const KEY_I = new KeyCode(KEYBOARD, 'KeyI');
const KEY_J = new KeyCode(KEYBOARD, 'KeyJ');
const KEY_K = new KeyCode(KEYBOARD, 'KeyK');
const KEY_L = new KeyCode(KEYBOARD, 'KeyL');
const KEY_M = new KeyCode(KEYBOARD, 'KeyM');
const KEY_N = new KeyCode(KEYBOARD, 'KeyN');
const KEY_O = new KeyCode(KEYBOARD, 'KeyO');
const KEY_P = new KeyCode(KEYBOARD, 'KeyP');
const KEY_Q = new KeyCode(KEYBOARD, 'KeyQ');
const KEY_R = new KeyCode(KEYBOARD, 'KeyR');
const KEY_S = new KeyCode(KEYBOARD, 'KeyS');
const KEY_T = new KeyCode(KEYBOARD, 'KeyT');
const KEY_U = new KeyCode(KEYBOARD, 'KeyU');
const KEY_V = new KeyCode(KEYBOARD, 'KeyV');
const KEY_W = new KeyCode(KEYBOARD, 'KeyW');
const KEY_X = new KeyCode(KEYBOARD, 'KeyX');
const KEY_Y = new KeyCode(KEYBOARD, 'KeyY');
const KEY_Z = new KeyCode(KEYBOARD, 'KeyZ');

const DIGIT_0 = new KeyCode(KEYBOARD, 'Digit0');
const DIGIT_1 = new KeyCode(KEYBOARD, 'Digit1');
const DIGIT_2 = new KeyCode(KEYBOARD, 'Digit2');
const DIGIT_3 = new KeyCode(KEYBOARD, 'Digit3');
const DIGIT_4 = new KeyCode(KEYBOARD, 'Digit4');
const DIGIT_5 = new KeyCode(KEYBOARD, 'Digit5');
const DIGIT_6 = new KeyCode(KEYBOARD, 'Digit6');
const DIGIT_7 = new KeyCode(KEYBOARD, 'Digit7');
const DIGIT_8 = new KeyCode(KEYBOARD, 'Digit8');
const DIGIT_9 = new KeyCode(KEYBOARD, 'Digit9');

const MINUS = new KeyCode(KEYBOARD, 'Minus');
const EQUAL = new KeyCode(KEYBOARD, 'Equal');
const BRACKET_LEFT = new KeyCode(KEYBOARD, 'BracketLeft');
const BRACKET_RIGHT = new KeyCode(KEYBOARD, 'BracketRight');
const SEMICOLON = new KeyCode(KEYBOARD, 'Semicolon');
const QUOTE = new KeyCode(KEYBOARD, 'Quote');
const BACKQUOTE = new KeyCode(KEYBOARD, 'Backquote');
const BACKSLASH = new KeyCode(KEYBOARD, 'Backslash');
const COMMA = new KeyCode(KEYBOARD, 'Comma');
const PERIOD = new KeyCode(KEYBOARD, 'Period');
const SLASH = new KeyCode(KEYBOARD, 'Slash');

const ESCAPE = new KeyCode(KEYBOARD, 'Escape');
const SPACE = new KeyCode(KEYBOARD, 'Space');
const CAPS_LOCK = new KeyCode(KEYBOARD, 'CapsLock');
const BACKSPACE = new KeyCode(KEYBOARD, 'Backspace');
const DELETE = new KeyCode(KEYBOARD, 'Delete');
const TAB = new KeyCode(KEYBOARD, 'Tab');
const ENTER = new KeyCode(KEYBOARD, 'Enter');

const ARROW_UP = new KeyCode(KEYBOARD, 'ArrowUp');
const ARROW_DOWN = new KeyCode(KEYBOARD, 'ArrowDown');
const ARROW_LEFT = new KeyCode(KEYBOARD, 'ArrowLeft');
const ARROW_RIGHT = new KeyCode(KEYBOARD, 'ArrowRight');

const MOUSE_BUTTON_0 = new KeyCode(MOUSE, 'Button0');
const MOUSE_BUTTON_1 = new KeyCode(MOUSE, 'Button1');
const MOUSE_BUTTON_2 = new KeyCode(MOUSE, 'Button2');
const MOUSE_BUTTON_3 = new KeyCode(MOUSE, 'Button3');
const MOUSE_BUTTON_4 = new KeyCode(MOUSE, 'Button4');

const MOUSE_POS_X = new KeyCode(MOUSE, 'PosX');
const MOUSE_POS_Y = new KeyCode(MOUSE, 'PosY');

const MOUSE_WHEEL_X = new KeyCode(MOUSE, 'WheelX');
const MOUSE_WHEEL_Y = new KeyCode(MOUSE, 'WheelY');
const MOUSE_WHEEL_Z = new KeyCode(MOUSE, 'WheelZ');

var KeyCodes = /*#__PURE__*/Object.freeze({
  __proto__: null,
  from: from,
  isKeyCode: isKeyCode,
  KEYBOARD: KEYBOARD,
  MOUSE: MOUSE,
  KEY_A: KEY_A,
  KEY_B: KEY_B,
  KEY_C: KEY_C,
  KEY_D: KEY_D,
  KEY_E: KEY_E,
  KEY_F: KEY_F,
  KEY_G: KEY_G,
  KEY_H: KEY_H,
  KEY_I: KEY_I,
  KEY_J: KEY_J,
  KEY_K: KEY_K,
  KEY_L: KEY_L,
  KEY_M: KEY_M,
  KEY_N: KEY_N,
  KEY_O: KEY_O,
  KEY_P: KEY_P,
  KEY_Q: KEY_Q,
  KEY_R: KEY_R,
  KEY_S: KEY_S,
  KEY_T: KEY_T,
  KEY_U: KEY_U,
  KEY_V: KEY_V,
  KEY_W: KEY_W,
  KEY_X: KEY_X,
  KEY_Y: KEY_Y,
  KEY_Z: KEY_Z,
  DIGIT_0: DIGIT_0,
  DIGIT_1: DIGIT_1,
  DIGIT_2: DIGIT_2,
  DIGIT_3: DIGIT_3,
  DIGIT_4: DIGIT_4,
  DIGIT_5: DIGIT_5,
  DIGIT_6: DIGIT_6,
  DIGIT_7: DIGIT_7,
  DIGIT_8: DIGIT_8,
  DIGIT_9: DIGIT_9,
  MINUS: MINUS,
  EQUAL: EQUAL,
  BRACKET_LEFT: BRACKET_LEFT,
  BRACKET_RIGHT: BRACKET_RIGHT,
  SEMICOLON: SEMICOLON,
  QUOTE: QUOTE,
  BACKQUOTE: BACKQUOTE,
  BACKSLASH: BACKSLASH,
  COMMA: COMMA,
  PERIOD: PERIOD,
  SLASH: SLASH,
  ESCAPE: ESCAPE,
  SPACE: SPACE,
  CAPS_LOCK: CAPS_LOCK,
  BACKSPACE: BACKSPACE,
  DELETE: DELETE,
  TAB: TAB,
  ENTER: ENTER,
  ARROW_UP: ARROW_UP,
  ARROW_DOWN: ARROW_DOWN,
  ARROW_LEFT: ARROW_LEFT,
  ARROW_RIGHT: ARROW_RIGHT,
  MOUSE_BUTTON_0: MOUSE_BUTTON_0,
  MOUSE_BUTTON_1: MOUSE_BUTTON_1,
  MOUSE_BUTTON_2: MOUSE_BUTTON_2,
  MOUSE_BUTTON_3: MOUSE_BUTTON_3,
  MOUSE_BUTTON_4: MOUSE_BUTTON_4,
  MOUSE_POS_X: MOUSE_POS_X,
  MOUSE_POS_Y: MOUSE_POS_Y,
  MOUSE_WHEEL_X: MOUSE_WHEEL_X,
  MOUSE_WHEEL_Y: MOUSE_WHEEL_Y,
  MOUSE_WHEEL_Z: MOUSE_WHEEL_Z
});

/**
 * @param {string|Array<string>} strings
 * @returns {Array<KeyCode>}
 */
function stringsToKeyCodes(strings) {
  if (!Array.isArray(strings)) {
    strings = [strings];
  }
  let result = [];
  for (let str of strings) {
    let keyCode;
    try {
      keyCode = KeyCode.parse(str);
    } catch (e) {
      let keyName = camelToSnakeCase(str).toUpperCase();
      if (!(keyName in KeyCodes)) {
        throw new Error('Invalid key code string - ' + e);
      }
      keyCode = KeyCodes[keyName];
    }
    result.push(keyCode);
  }
  return result;
}

/**
 * @param {string} str
 * @returns {string}
 */
function camelToSnakeCase(str) {
  return str
    .replace(/([a-z]|(?:[A-Z0-9]+))([A-Z0-9]|$)/g, function (_, a, b) {
      return a + (b && '_' + b);
    })
    .toLowerCase();
}

/** @typedef {import('../keycode/KeyCode.js').KeyCode} KeyCode */

class AxisBinding extends InputBinding {
  /**
   * @param {string} name
   * @param {string} device
   * @param {string} code
   * @param {object} [opts]
   * @returns {AxisBinding}
   */
  static fromBind(name, device, code, opts = undefined) {
    return new AxisBinding(name, from$1(device, code), opts);
  }

  /**
   * @param {string} name
   * @param {...string} strings
   * @returns {AxisBinding}
   */
  static fromString(name, ...strings) {
    let keyCodes = stringsToKeyCodes(strings);
    return new AxisBinding(name, keyCodes);
  }

  /** @returns {number} */
  get delta() {
    if (!this.ref || this.disabled) {
      return 0;
    }
    return this.ref.delta;
  }

  /**
   * @param {string} name
   * @param {KeyCode|Array<KeyCode>} keyCodes
   * @param {object} [opts]
   */
  constructor(name, keyCodes, opts = undefined) {
    super(name);

    /** @protected */
    this.keyCodes = Array.isArray(keyCodes) ? keyCodes : [keyCodes];
    /** @protected */
    this.opts = opts;
  }

  /**
   * @override
   * @param {import('../InputContext.js').InputContext} inputContext
   */
  register(inputContext) {
    let name = this.name;
    let opts = this.opts;
    for (let keyCode of this.keyCodes) {
      inputContext.bindAxis(name, keyCode.device, keyCode.code, opts);
    }
    this.ref = inputContext.getAxis(name);
    return this;
  }
}

/** @typedef {import('../keycode/KeyCode.js').KeyCode} KeyCode */

class ButtonBinding extends InputBinding {
  /**
   * @param {string} name
   * @param {string} device
   * @param {string} code
   * @param {object} [opts]
   * @returns {ButtonBinding}
   */
  static fromBind(name, device, code, opts = undefined) {
    return new ButtonBinding(name, from(device, code), opts);
  }

  /**
   * @param {string} name
   * @param {...string} strings
   * @returns {ButtonBinding}
   */
  static fromString(name, ...strings) {
    let keyCodes = stringsToKeyCodes(strings);
    return new ButtonBinding(name, keyCodes);
  }

  /** @returns {boolean} */
  get pressed() {
    if (!this.ref || this.disabled) {
      return false;
    }
    return this.ref.pressed;
  }

  /** @returns {boolean} */
  get repeated() {
    if (!this.ref || this.disabled) {
      return false;
    }
    return this.ref.repeated;
  }

  /** @returns {boolean} */
  get released() {
    if (!this.ref || this.disabled) {
      return false;
    }
    return this.ref.released;
  }

  /** @returns {boolean} */
  get down() {
    if (!this.ref || this.disabled) {
      return false;
    }
    return this.ref.down;
  }

  /**
   * @param {string} name
   * @param {KeyCode|Array<KeyCode>} keyCodes
   * @param {object} [opts]
   */
  constructor(name, keyCodes, opts = undefined) {
    super(name);

    /** @protected */
    this.keyCodes = Array.isArray(keyCodes) ? keyCodes : [keyCodes];
    /** @protected */
    this.opts = opts;
  }

  /**
   * @override
   * @param {import('../InputContext.js').InputContext} inputContext
   */
  register(inputContext) {
    let name = this.name;
    let opts = this.opts;
    for (let keyCode of this.keyCodes) {
      inputContext.bindButton(name, keyCode.device, keyCode.code, opts);
    }
    this.ref = inputContext.getButton(name);
    return this;
  }
}

/** @typedef {import('../keycode/KeyCode.js').KeyCode} KeyCode */

class AxisButtonBinding extends AxisBinding {
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
    super(name, []);

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
class InputDevice {
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

/** @typedef {import('./InputDevice.js').InputDeviceEvent} InputDeviceEvent */

/**
 * A class that listens to the keyboard events from the event target and
 * transforms the events into a valid {@link InputEvent} for the added
 * listeners.
 *
 * - This device uses the `event.code` standard to reference each key.
 * - Use this to help you determine the key code: https://keycode.info/
 */
class KeyboardDevice extends InputDevice {
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
class MouseDevice extends InputDevice {
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

var INNER_HTML$1 = "<kbd>\n  <span id=\"name\"><slot></slot></span>\n  <span id=\"value\" class=\"hidden\"></span>\n</kbd>\n";

var INNER_STYLE$1 = "kbd {\n  position: relative;\n  display: inline-block;\n  border-radius: 3px;\n  border: 1px solid #888888;\n  font-size: 0.85em;\n  font-weight: 700;\n  text-rendering: optimizeLegibility;\n  line-height: 12px;\n  height: 14px;\n  padding: 2px 4px;\n  color: #444444;\n  background-color: #eeeeee;\n  box-shadow: inset 0 -3px 0 #aaaaaa;\n  overflow: hidden;\n}\n\nkbd:empty::after {\n  content: '<?>';\n  opacity: 0.6;\n}\n\n.disabled {\n  opacity: 0.6;\n  box-shadow: none;\n  background-color: #aaaaaa;\n}\n\n.hidden {\n  display: none;\n}\n\n#value {\n  position: absolute;\n  top: 0;\n  bottom: 0;\n  right: 0;\n  font-size: 0.85em;\n  padding: 0 4px;\n  padding-top: 2px;\n  color: #cccccc;\n  background-color: #333333;\n  box-shadow: inset 0 3px 0 #222222;\n}\n";

class InputCode extends HTMLElement {
  /** @protected */
  static get [Symbol.for('templateNode')]() {
    let t = document.createElement('template');
    t.innerHTML = INNER_HTML$1;
    Object.defineProperty(this, Symbol.for('templateNode'), { value: t });
    return t;
  }

  /** @protected */
  static get [Symbol.for('styleNode')]() {
    let t = document.createElement('style');
    t.innerHTML = INNER_STYLE$1;
    Object.defineProperty(this, Symbol.for('styleNode'), { value: t });
    return t;
  }

  static define(customElements = window.customElements) {
    customElements.define('input-code', this);
  }

  /** @override */
  static get observedAttributes() {
    return ['name', 'value', 'disabled'];
  }

  /** @returns {boolean} */
  get disabled() {
    return this._disabled;
  }

  set disabled(value) {
    this.toggleAttribute('disabled', value);
  }

  /** @returns {string} */
  get value() {
    return this._value;
  }

  set value(value) {
    this.setAttribute('value', value);
  }

  /** @returns {string} */
  get name() {
    return this._name;
  }

  set name(value) {
    this.setAttribute('name', value);
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(
      this.constructor[Symbol.for('templateNode')].content.cloneNode(true)
    );
    this.shadowRoot.appendChild(
      this.constructor[Symbol.for('styleNode')].cloneNode(true)
    );

    /** @private */
    this._name = '';
    /** @private */
    this._value = '';
    /** @private */
    this._disabled = false;

    /** @private */
    this._kbdElement = this.shadowRoot.querySelector('kbd');
    /** @private */
    this._nameElement = this.shadowRoot.querySelector('#name');
    /** @private */
    this._valueElement = this.shadowRoot.querySelector('#value');
  }

  /** @override */
  attributeChangedCallback(attribute, prev, value) {
    switch (attribute) {
      case 'name':
        this._name = value;
        this._nameElement.textContent = value;
        break;
      case 'value':
        this._value = value;
        if (value !== null) {
          this._valueElement.classList.toggle('hidden', false);
          this._valueElement.textContent = value;
          this._kbdElement.style.paddingRight = `${
            this._valueElement.clientWidth + 4
          }px`;
        } else {
          this._valueElement.classList.toggle('hidden', true);
        }
        break;
      case 'disabled':
        this._disabled = value !== null;
        this._kbdElement.classList.toggle('disabled', value !== null);
        break;
    }
  }

  /** @override */
  connectedCallback() {
    if (Object.prototype.hasOwnProperty.call(this, 'name')) {
      let value = this.name;
      delete this.name;
      this.name = value;
    }

    if (Object.prototype.hasOwnProperty.call(this, 'value')) {
      let value = this.value;
      delete this.value;
      this.value = value;
    }

    if (Object.prototype.hasOwnProperty.call(this, 'disabled')) {
      let value = this.disabled;
      delete this.disabled;
      this.disabled = value;
    }
  }
}
InputCode.define();

var INNER_HTML = "<table>\n  <thead>\n    <tr class=\"tableHeader\">\n      <th colspan=\"3\">\n        <span class=\"tableTitle\">\n          <label id=\"title\"> input-source </label>\n          <span id=\"slotContainer\">\n            <slot></slot>\n          </span>\n          <p>\n            <label for=\"poll\">poll</label>\n            <output id=\"poll\"></output>\n          </p>\n          <p>\n            <label for=\"focus\">focus</label>\n            <output id=\"focus\"></output>\n          </p>\n        </span>\n      </th>\n    </tr>\n    <tr class=\"colHeader\">\n      <th>name</th>\n      <th>value</th>\n      <th>key</th>\n    </tr>\n  </thead>\n  <tbody></tbody>\n</table>\n";

var INNER_STYLE = ":host {\n  display: block;\n}\n\ntable {\n  border-collapse: collapse;\n  font-family: monospace;\n}\n\ntable,\nth,\ntd {\n  border: 1px solid #666666;\n}\n\nth,\ntd {\n  padding: 5px 10px;\n}\n\ntd {\n  text-align: center;\n}\n\nthead th {\n  padding: 0;\n}\n\n.colHeader > th {\n  font-size: 0.8em;\n  padding: 0 10px;\n  letter-spacing: 3px;\n  background-color: #aaaaaa;\n  color: #666666;\n}\n\ntbody output {\n  border-radius: 0.3em;\n  padding: 3px;\n}\n\ntr:not(.primary) .name,\ntr:not(.primary) .value {\n  opacity: 0.3;\n}\n\ntr:nth-child(2n) {\n  background-color: #eeeeee;\n}\n\n.tableHeader {\n  color: #666666;\n}\n\n.tableTitle {\n  display: flex;\n  flex-direction: row;\n  align-items: center;\n  padding: 4px;\n}\n\n#slotContainer {\n  flex: 1;\n}\n\np {\n  display: inline;\n  margin: 0;\n  padding: 0;\n  padding-right: 10px;\n}\n\n#poll:empty::after,\n#focus:empty::after {\n  content: '✗';\n  color: #ff0000;\n}\n";

/**
 * @callback OnPollCallback
 * @param {number} now
 *
 * @typedef Pollable
 * @property {OnPollCallback} onPoll
 */

/**
 * A class to automatically call onPoll() on animation frame.
 */
class AutoPoller {
  /**
   * @param {Pollable} pollable
   */
  constructor(pollable) {
    /** @private */
    this.onAnimationFrame = this.onAnimationFrame.bind(this);
    /** @private */
    this.animationFrameHandle = null;
    /** @private */
    this.pollable = pollable;
  }

  get running() {
    return this.animationFrameHandle !== null;
  }

  start() {
    let handle = this.animationFrameHandle;
    if (handle) cancelAnimationFrame(handle);
    this.animationFrameHandle = requestAnimationFrame(this.onAnimationFrame);
  }

  stop() {
    let handle = this.animationFrameHandle;
    if (handle) cancelAnimationFrame(handle);
    this.animationFrameHandle = null;
  }

  /** @private */
  onAnimationFrame(now) {
    this.animationFrameHandle = requestAnimationFrame(this.onAnimationFrame);
    this.pollable.onPoll(now);
  }
}

/** @typedef {import('./InputBindings.js').InputBindings} InputBindings */

/**
 * A class to listen and transform device events through
 * each mapped bindings into an input state.
 *
 * It requires onPoll() to be called to keep the input
 * state up to date. This is usually called from
 * requestAnimationFrame() or using the AutoPoller.
 */
class DeviceInputAdapter {
  /**
   * @param {InputBindings} bindings
   */
  constructor(bindings) {
    /** @private */
    this.onInput = this.onInput.bind(this);
    /** @private */
    this.onPoll = this.onPoll.bind(this);

    this.bindings = bindings;
  }

  /** @private */
  onPoll(now) {
    for (let input of this.bindings.getInputs()) {
      input.onPoll(now);
    }
  }

  /** @private */
  onInput(e) {
    const {
      device,
      code,
      event,
      value,
      movement,
      // eslint-disable-next-line no-unused-vars
      control,
      shift,
      alt,
    } = e;
    let bindings = this.bindings.getBindings(device, code);
    switch (event) {
      case 'pressed':
        for (let { input, index } of bindings) {
          input.onUpdate(index, 1, 1);
        }
        break;
      case 'released':
        for (let { input, index } of bindings) {
          input.onUpdate(index, 0, -1);
        }
        break;
      case 'move':
        for (let { input, index } of bindings) {
          input.onUpdate(index, value, movement);
        }
        break;
      case 'wheel':
        for (let { input, index } of bindings) {
          input.onUpdate(index, undefined, movement);
        }
        break;
    }
    return bindings.length > 0;
  }
}

/**
 * @typedef {import('./axisbutton/InputBase.js').InputBase} InputBase
 * @typedef {import('./axisbutton/InputBase.js').BindingOptions} BindingOptions
 *
 * @typedef {string} DeviceName
 * @typedef {string} KeyCode
 */

class Binding {
  /**
   * @param {DeviceName} device The name of the device
   * @param {KeyCode} code The key code for the device
   * @param {InputBase} input The parent input
   * @param {number} index The binding index for the input
   */
  constructor(device, code, input, index) {
    /** Name of the device */
    this.device = device;
    /** The key code for the device */
    this.code = code;
    /** The parent input */
    this.input = input;
    /** The binding index for the input */
    this.index = index;
  }
}

/**
 * A class that maps inputs to their respective key bindings.
 *
 * This does not handle input state (refer to InputBase.js) nor
 * input events (refer to InputDevice.js). It is only responsible
 * for the redirection of key codes to their bound input. Usually
 * this is used together with the interfaces referenced above.
 */
class InputBindings {
  constructor() {
    /**
     * @private
     * @type {Record<DeviceName, Record<KeyCode, Array<Binding>>}
     */
    this.bindingMap = {};
    /**
     * @private
     * @type {Map<InputBase, Array<Binding>>}
     */
    this.inputMap = new Map();
  }

  clear() {
    for (let input of this.inputMap.keys()) {
      input.onUnbind();
    }
    this.inputMap.clear();
    this.bindingMap = {};
  }

  /**
   * @param {InputBase} input
   * @param {DeviceName} device
   * @param {KeyCode} code
   * @param {BindingOptions} [opts]
   */
  bind(input, device, code, opts = { inverted: false }) {
    let binding;

    let inputMap = this.inputMap;
    if (inputMap.has(input)) {
      let bindings = inputMap.get(input);
      let index = input.size;
      input.onBind(index, opts);
      binding = new Binding(device, code, input, index);
      bindings.push(binding);
    } else {
      let bindings = [];
      inputMap.set(input, bindings);
      let index = 0;
      input.onBind(index, opts);
      binding = new Binding(device, code, input, index);
      bindings.push(binding);
    }

    let bindingMap = this.bindingMap;
    if (device in bindingMap) {
      if (code in bindingMap[device]) {
        bindingMap[device][code].push(binding);
      } else {
        bindingMap[device][code] = [binding];
      }
    } else {
      bindingMap[device] = { [code]: [binding] };
    }
  }

  /**
   * @param {InputBase} input
   */
  unbind(input) {
    let inputMap = this.inputMap;
    if (inputMap.has(input)) {
      let bindingMap = this.bindingMap;
      let bindings = inputMap.get(input);
      for (let binding of bindings) {
        let { device, code } = binding;
        let boundList = bindingMap[device][code];
        let i = boundList.indexOf(binding);
        boundList.splice(i, 1);
      }
      bindings.length = 0;
      input.onUnbind();
      inputMap.delete(input);
    }
  }

  /**
   * @param {InputBase} input
   * @returns {boolean}
   */
  isBound(input) {
    return this.inputMap.has(input);
  }

  /** @returns {IterableIterator<InputBase>} */
  getInputs() {
    return this.inputMap.keys();
  }

  /** @returns {IterableIterator<Binding>} */
  getBindingsByInput(input) {
    return this.inputMap.get(input);
  }

  /**
   * @param {DeviceName} device
   * @param {KeyCode} code
   * @returns {IterableIterator<Binding>}
   */
  getBindings(device, code) {
    let deviceCodeBindings = this.bindingMap;
    if (device in deviceCodeBindings) {
      let codeBindings = deviceCodeBindings[device];
      if (code in codeBindings) {
        return codeBindings[code];
      }
    }
    return [];
  }
}

/**
 * @typedef {import('./device/InputDevice.js').InputDevice} InputDevice
 * @typedef {import('./device/InputDevice.js').InputDeviceEvent} InputDeviceEvent
 * @typedef {import('./axisbutton/InputBase.js').InputBase} InputBase
 * @typedef {import('./InputBindings.js').DeviceName} DeviceName
 * @typedef {import('./InputBindings.js').KeyCode} KeyCode
 * @typedef {import('./InputBindings.js').BindingOptions} BindingOptions
 *
 * @typedef {import('./binding/InputBinding.js').InputBinding} InputBinding
 *
 * @typedef {string} InputName
 */

/**
 * @typedef {'bind'|'unbind'|'focus'|'blur'} InputContextEventType
 * @typedef {(e: InputContextEvent) => boolean} InputContextEventListener
 * @typedef InputContextEvent
 * @property {InputContextEventType} type
 */

class InputContext {
  /**
   * @param {EventTarget} eventTarget
   * @param {object} [opts]
   */
  constructor(eventTarget, opts = {}) {
    /**
     * @type {Record<string, Axis|Button>}
     */
    this.inputs = {};
    /**
     * @type {Array<InputDevice>}
     */
    this.devices = [
      new MouseDevice('Mouse', eventTarget),
      new KeyboardDevice('Keyboard', eventTarget),
    ];
    this.bindings = new InputBindings();
    this.adapter = new DeviceInputAdapter(this.bindings);
    this.autopoller = new AutoPoller(this.adapter);

    /** @protected */
    this.eventTarget = eventTarget;
    /** @protected */
    this.anyButton = new Button(1);
    /** @protected */
    this.anyButtonDevice = '';
    /** @protected */
    this.anyButtonCode = '';
    /** @protected */
    this.anyAxis = new Axis(1);
    /** @protected */
    this.anyAxisDevice = '';
    /** @protected */
    this.anyAxisCode = '';

    /**
     * @private
     * @type {Record<InputContextEventType, Array<InputContextEventListener>>}
     */
    this.listeners = {
      bind: [],
      unbind: [],
      focus: [],
      blur: [],
    };

    // Prepare listeners
    /** @private */
    this.onInput = this.onInput.bind(this);
    /** @private */
    this.onEventTargetBlur = this.onEventTargetBlur.bind(this);
    /** @private */
    this.onEventTargetFocus = this.onEventTargetFocus.bind(this);

    // Attach listeners
    eventTarget.addEventListener('focus', this.onEventTargetFocus);
    eventTarget.addEventListener('blur', this.onEventTargetBlur);
    for (let device of this.devices) {
      device.addEventListener('input', this.onInput);
    }
  }

  get autopoll() {
    return this.autopoller.running;
  }

  set autopoll(value) {
    this.toggleAutoPoll(value);
  }

  destroy() {
    let listeners = this.listeners;
    for (let event in listeners) {
      listeners[event].length = 0;
    }
    if (this.autopoller.running) {
      this.autopoller.stop();
    }
    for (let device of this.devices) {
      device.removeEventListener('input', this.onInput);
      device.destroy();
    }
    let eventTarget = this.eventTarget;
    eventTarget.removeEventListener('focus', this.onEventTargetFocus);
    eventTarget.removeEventListener('blur', this.onEventTargetBlur);
  }

  setEventTarget(eventTarget) {
    let oldEventTarget = this.eventTarget;
    oldEventTarget.removeEventListener('focus', this.onEventTargetFocus);
    oldEventTarget.removeEventListener('blur', this.onEventTargetBlur);

    this.eventTarget = eventTarget;
    for (let device of this.devices) {
      device.setEventTarget(eventTarget);
    }
    eventTarget.addEventListener('focus', this.onEventTargetFocus);
    eventTarget.addEventListener('blur', this.onEventTargetBlur);
  }

  toggleAutoPoll(force = undefined) {
    let current = this.autopoller.running;
    let next = typeof force === 'undefined' ? !current : Boolean(force);
    if (next === current) return;
    if (next) {
      this.autopoller.start();
    } else {
      this.autopoller.stop();
    }
  }

  /**
   * @param {InputContextEventType} event
   * @param {InputContextEventListener} listener
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
   * @param {InputContextEventType} event
   * @param {InputContextEventListener} listener
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
   * @param {InputContextEvent} e
   * @returns {boolean} Whether the event should be consumed.
   */
  dispatchEvent(e) {
    const { type } = e;
    let flag = 0;
    for (let listener of this.listeners[type]) {
      flag |= listener(e) ? 1 : 0;
    }
    return Boolean(flag);
  }

  /**
   * @param {number} now
   */
  poll(now = performance.now()) {
    if (this.autopoller.running) {
      throw new Error('Should not manually poll() while autopolling.');
    }
    this.onPoll(now);
  }

  /**
   * @private
   * @param {InputDeviceEvent} e
   */
  onInput(e) {
    let result = this.adapter.onInput(e);
    switch (e.event) {
      case 'pressed':
        this.anyButtonDevice = e.device;
        this.anyButtonCode = e.code;
        this.anyButton.onUpdate(0, 1, 1);
        break;
      case 'released':
        this.anyButtonDevice = e.device;
        this.anyButtonCode = e.code;
        this.anyButton.onUpdate(0, 0, -1);
        break;
      case 'move':
      case 'wheel':
        this.anyAxisDevice = e.device;
        this.anyAxisCode = e.code;
        this.anyAxis.onUpdate(0, e.value, e.movement);
        break;
    }
    return result;
  }

  /**
   * @private
   * @param {number} now
   */
  onPoll(now) {
    this.adapter.onPoll(now);
    this.anyButton.onPoll(now);
    this.anyAxis.onPoll(now);
  }

  /** @private */
  onBind() {
    this.dispatchEvent({
      type: 'bind',
    });
  }

  /** @private */
  onUnbind() {
    this.dispatchEvent({
      type: 'unbind',
    });
  }

  /** @private */
  onEventTargetFocus() {
    this.dispatchEvent({
      type: 'focus',
    });
  }

  /** @private */
  onEventTargetBlur() {
    // Clear all input states.
    for (let input of this.bindings.getInputs()) {
      input.onStatus(0, 0);
    }
    this.anyButton.onStatus(0, 0);
    this.anyAxis.onStatus(0, 0);
    this.dispatchEvent({
      type: 'blur',
    });
  }

  /**
   * @param {Array<InputBinding>} bindings
   */
  bindBindings(bindings) {
    for (let binding of bindings) {
      binding.register(this);
    }
  }

  /**
   * @param {InputName} name
   * @param {DeviceName} device
   * @param {KeyCode} code
   * @param {BindingOptions} [opts]
   */
  bindButton(name, device, code, opts = undefined) {
    let input;
    if (this.hasButton(name)) {
      input = this.getButton(name);
    } else {
      input = new Button(1);
      this.inputs[name] = input;
    }
    this.bindings.bind(input, device, code, opts);
    this.onBind();
  }

  /**
   * @param {string} name
   * @param {DeviceName} device
   * @param {KeyCode} code
   * @param {BindingOptions} [opts]
   */
  bindAxis(name, device, code, opts = undefined) {
    let input;
    if (this.hasAxis(name)) {
      input = this.getAxis(name);
    } else {
      input = new Axis(1);
      this.inputs[name] = input;
    }
    this.bindings.bind(input, device, code, opts);
    this.onBind();
  }

  /**
   * @param {string} name
   * @param {DeviceName} device
   * @param {KeyCode} negativeCode
   * @param {KeyCode} positiveCode
   */
  bindAxisButtons(name, device, negativeCode, positiveCode) {
    let input;
    if (this.hasAxis(name)) {
      input = this.getAxis(name);
    } else {
      input = new Axis(2);
      this.inputs[name] = input;
    }
    this.bindings.bind(input, device, positiveCode);
    this.bindings.bind(input, device, negativeCode, { inverted: true });
    this.onBind();
  }

  /**
   * @param {string} name
   */
  unbindButton(name) {
    if (this.hasButton(name)) {
      let input = this.getButton(name);
      delete this.inputs[name];
      this.bindings.unbind(input);
      this.onUnbind();
    }
  }

  /**
   * @param {string} name
   */
  unbindAxis(name) {
    if (this.hasAxis(name)) {
      let input = this.getAxis(name);
      delete this.inputs[name];
      this.bindings.unbind(input);
      this.onUnbind();
    }
  }

  /**
   * Get the input for the given name. Assumes the input already exists for the name.
   * @param {InputName} name
   * @returns {InputBase}
   */
  getInput(name) {
    return this.inputs[name];
  }

  /**
   * Get the button for the given name. Assumes a button already exists for the name.
   * @param {InputName} name
   * @returns {Button}
   */
  getButton(name) {
    return /** @type {Button} */ (this.inputs[name]);
  }

  /**
   * Get the axis for the given name. Assumes an axis already exists for the name.
   * @param {InputName} name
   * @returns {Axis}
   */
  getAxis(name) {
    return /** @type {Axis} */ (this.inputs[name]);
  }

  /**
   * Whether a button exists for the name and that it is of type {@link Button}.
   * @returns {boolean}
   */
  hasButton(name) {
    return name in this.inputs && this.inputs[name] instanceof Button;
  }

  /**
   * Whether an axis exists for the name and that it is of type {@link Axis}.
   * @returns {boolean}
   */
  hasAxis(name) {
    return name in this.inputs && this.inputs[name] instanceof Axis;
  }

  /**
   * Get whether a button for the given name is down. Assumes a button already exists for the name.
   * @param {InputName} name
   * @returns {boolean}
   */
  isButtonDown(name) {
    return /** @type {Button} */ (this.inputs[name]).down;
  }

  /**
   * Get whether a button for the given name is pressed. Assumes a button already exists for the name.
   * @param {InputName} name
   * @returns {boolean}
   */
  isButtonPressed(name) {
    return /** @type {Button} */ (this.inputs[name]).pressed;
  }

  /**
   * Get whether a button for the given name is released. Assumes a button already exists for the name.
   * @param {InputName} name
   * @returns {boolean}
   */
  isButtonReleased(name) {
    return /** @type {Button} */ (this.inputs[name]).released;
  }

  /**
   * @param {InputName} name
   * @returns {number}
   */
  getInputValue(name) {
    return this.inputs[name].value;
  }

  /**
   * @param {InputName} name
   * @returns {number}
   */
  getButtonValue(name) {
    return this.inputs[name].value;
  }

  /**
   * @param {InputName} name
   * @returns {number}
   */
  getAxisValue(name) {
    return this.inputs[name].value;
  }

  /**
   * @param {InputName} name
   * @returns {number}
   */
  getAxisDelta(name) {
    return /** @type {Axis} */ (this.inputs[name]).delta;
  }

  /** @returns {boolean} */
  isAnyButtonDown(include = undefined) {
    if (typeof include === 'undefined') {
      return this.anyButton.down;
    } else {
      let buttons = this.inputs;
      for (let name of include) {
        let button = /** @type {Button} */ (buttons[name]);
        if (button.down) {
          return true;
        }
      }
    }
    return false;
  }

  /** @returns {boolean} */
  isAnyButtonPressed(include = undefined) {
    if (typeof include === 'undefined') {
      return this.anyButton.pressed;
    } else {
      let buttons = this.inputs;
      for (let name of include) {
        let button = /** @type {Button} */ (buttons[name]);
        if (button.pressed) {
          return true;
        }
      }
    }
    return false;
  }

  /** @returns {boolean} */
  isAnyButtonReleased(include = undefined) {
    if (typeof include === 'undefined') {
      return this.anyButton.released;
    } else {
      let buttons = this.inputs;
      for (let name of include) {
        let button = /** @type {Button} */ (buttons[name]);
        if (button.released) {
          return true;
        }
      }
    }
    return false;
  }

  /** @returns {number} */
  getAnyAxisValue(include = undefined) {
    if (typeof include === 'undefined') {
      return this.anyAxis.value;
    } else {
      let axes = this.inputs;
      for (let name of include) {
        let axis = axes[name];
        if (axis.value) {
          return axis.value;
        }
      }
    }
    return 0;
  }

  /** @returns {number} */
  getAnyAxisDelta(include = undefined) {
    if (typeof include === 'undefined') {
      return this.anyAxis.delta;
    } else {
      let axes = this.inputs;
      for (let name of include) {
        let axis = /** @type {Axis} */ (axes[name]);
        if (axis.delta) {
          return axis.delta;
        }
      }
    }
    return 0;
  }

  getLastButtonDevice() {
    return this.anyButtonDevice;
  }

  getLastButtonCode() {
    return this.anyButtonCode;
  }

  getLastAxisDevice() {
    return this.anyAxisDevice;
  }

  getLastAxisCode() {
    return this.anyAxisCode;
  }

  getMouse() {
    return /** @type {MouseDevice}*/ (this.devices[0]);
  }

  getKeyboard() {
    return /** @type {KeyboardDevice}*/ (this.devices[1]);
  }
}

/**
 * @typedef {import('../device/InputDevice.js').InputDevice} InputDevice
 * @typedef {import('../device/InputDevice.js').InputDeviceEvent} InputDeviceEvent
 * @typedef {import('../axisbutton/InputBase.js').InputBase} InputBase
 * @typedef {import('../InputBindings.js').DeviceName} DeviceName
 * @typedef {import('../InputBindings.js').KeyCode} KeyCode
 * @typedef {import('../InputBindings.js').BindingOptions} BindingOptions
 *
 * @typedef {string} InputName
 */

class InputPort extends HTMLElement {
  /** @protected */
  static get [Symbol.for('templateNode')]() {
    let t = document.createElement('template');
    t.innerHTML = INNER_HTML;
    Object.defineProperty(this, Symbol.for('templateNode'), { value: t });
    return t;
  }

  /** @protected */
  static get [Symbol.for('styleNode')]() {
    let t = document.createElement('style');
    t.innerHTML = INNER_STYLE;
    Object.defineProperty(this, Symbol.for('styleNode'), { value: t });
    return t;
  }

  static define(customElements = window.customElements) {
    customElements.define('input-port', this);
  }

  /** @override */
  static get observedAttributes() {
    return ['autopoll', 'for'];
  }

  /** @returns {boolean} */
  get autopoll() {
    return this._autopoll;
  }

  set autopoll(value) {
    this.toggleAttribute('autopoll', value);
  }

  /** @returns {string} */
  get for() {
    return this._for;
  }

  set for(value) {
    this.setAttribute('for', value);
  }

  constructor() {
    super();
    const shadowRoot = this.attachShadow({ mode: 'open' });
    shadowRoot.appendChild(
      this.constructor[Symbol.for('templateNode')].content.cloneNode(true)
    );
    shadowRoot.appendChild(
      this.constructor[Symbol.for('styleNode')].cloneNode(true)
    );

    /** @private */
    this._titleElement = shadowRoot.querySelector('#title');
    /** @private */
    this._pollElement = shadowRoot.querySelector('#poll');
    /** @private */
    this._focusElement = shadowRoot.querySelector('#focus');
    /** @private */
    this._bodyElement = shadowRoot.querySelector('tbody');
    /** @private */
    this._outputElements = {};

    /** @private */
    this.onAnimationFrame = this.onAnimationFrame.bind(this);
    /** @private */
    this.animationFrameHandle = null;

    const eventTarget = this;
    /** @private */
    this._for = '';
    /** @private */
    this._eventTarget = eventTarget;
    /** @private */
    this._autopoll = false;

    /** @private */
    this._context = null;

    /** @private */
    this.onInputContextBind = this.onInputContextBind.bind(this);
    /** @private */
    this.onInputContextUnbind = this.onInputContextUnbind.bind(this);
    /** @private */
    this.onInputContextFocus = this.onInputContextFocus.bind(this);
    /** @private */
    this.onInputContextBlur = this.onInputContextBlur.bind(this);
  }

  /** @override */
  connectedCallback() {
    if (Object.prototype.hasOwnProperty.call(this, 'for')) {
      let value = this.for;
      delete this.for;
      this.for = value;
    }

    if (Object.prototype.hasOwnProperty.call(this, 'autopoll')) {
      let value = this.autopoll;
      delete this.autopoll;
      this.autopoll = value;
    }

    // Make sure the table and values are up to date
    this.updateTable();
    this.updateTableValues();
    this.animationFrameHandle = requestAnimationFrame(this.onAnimationFrame);
  }

  /** @override */
  disconnectedCallback() {
    let ctx = this._context;
    if (ctx) {
      ctx.removeEventListener('bind', this.onInputContextBind);
      ctx.removeEventListener('unbind', this.onInputContextUnbind);
      ctx.removeEventListener('blur', this.onInputContextBlur);
      ctx.removeEventListener('focus', this.onInputContextFocus);
      ctx.destroy();
      this._context = null;
    }
  }

  /** @override */
  attributeChangedCallback(attribute, prev, value) {
    switch (attribute) {
      case 'for':
        {
          this._for = value;
          let target;
          let name;
          if (value) {
            target = document.getElementById(value);
            name = `${target.tagName.toLowerCase()}#${value}`;
          } else {
            target = this;
            name = 'input-port';
          }
          this._eventTarget = target;
          if (this._context) {
            this._context.setEventTarget(this._eventTarget);
          }
          // For debug info
          this._titleElement.innerHTML = `for ${name}`;
        }
        break;
      case 'autopoll':
        this._autopoll = value !== null;
        if (this._context) {
          this._context.toggleAutoPoll(this._autopoll);
        }
        break;
    }
  }

  /** @private */
  onAnimationFrame() {
    this.animationFrameHandle = requestAnimationFrame(this.onAnimationFrame);
    this.updateTableValues();
    this.updatePollStatus();
  }

  /** @private */
  onInputContextBind() {
    this.updateTable();
    return true;
  }

  /** @private */
  onInputContextUnbind() {
    this.updateTable();
    return true;
  }

  /** @private */
  onInputContextFocus() {
    this._focusElement.innerHTML = '✓';
    return true;
  }

  /** @private */
  onInputContextBlur() {
    this._focusElement.innerHTML = '';
    return true;
  }

  /**
   * @param {'axisbutton'} [contextId]
   * @param {object} [options]
   * @returns {InputContext}
   */
  getContext(contextId = 'axisbutton', options = undefined) {
    switch (contextId) {
      case 'axisbutton':
        if (!this._context) {
          let ctx = new InputContext(this._eventTarget, options);
          ctx.addEventListener('bind', this.onInputContextBind);
          ctx.addEventListener('unbind', this.onInputContextUnbind);
          ctx.addEventListener('blur', this.onInputContextBlur);
          ctx.addEventListener('focus', this.onInputContextFocus);
          if (this._autopoll) {
            ctx.toggleAutoPoll(true);
          }
          this._context = ctx;
        }
        return this._context;
      default:
        throw new Error(`Input context id '${contextId}' is not supported.`);
    }
  }

  /** @private */
  updateTable() {
    if (!this.isConnected) {
      // Don't update the DOM if not connected to any :(
      return;
    } else if (!this._context) {
      // Clear all values if no context is available
      this._outputElements = {};
      this._bodyElement.innerHTML = '';
      return;
    } else {
      let context = this._context;
      let inputs = context.inputs;
      let bindings = context.bindings;
      let primaryElements = {};
      let entries = [];
      for (let name of Object.keys(inputs)) {
        let input = inputs[name];
        let primary = true;
        for (let binding of bindings.getBindingsByInput(input)) {
          let element = createInputTableEntry(
            `${input.constructor.name}.${name}`,
            `${binding.device}.${binding.code}`,
            0,
            primary
          );
          entries.push(element);
          if (primary) {
            primaryElements[name] = element.querySelector('output');
            primary = false;
          }
        }
      }
      this._outputElements = primaryElements;
      this._bodyElement.innerHTML = '';
      for (let entry of entries) {
        this._bodyElement.appendChild(entry);
      }
    }
  }

  /** @private */
  updateTableValues() {
    if (!this.isConnected) {
      // Don't update the DOM if not connected to any :(
      return;
    } else if (!this._context) {
      // Clear all values if no context is available
      for (let name of Object.keys(this._outputElements)) {
        let element = this._outputElements[name];
        element.innerText = '---';
      }
      return;
    } else {
      let context = this._context;
      let inputs = context.inputs;
      for (let name of Object.keys(this._outputElements)) {
        let element = this._outputElements[name];
        let value = inputs[name].value;
        element.innerText = Number(value).toFixed(2);
      }
    }
  }

  /** @private */
  updatePollStatus() {
    if (!this.isConnected) {
      // Don't update the DOM if not connected to any :(
      return;
    } else if (!this._context) {
      // Clear all values if no context is available
      this._pollElement.innerHTML = '-';
      return;
    } else {
      let context = this._context;
      let inputs = context.inputs;
      for (let input of Object.values(inputs)) {
        if (!input.polling) {
          this._pollElement.innerHTML = '';
          return;
        }
      }
      this._pollElement.innerHTML = '✓';
    }
  }
}
InputPort.define();

function createInputTableEntry(name, key, value, primary = true) {
  let row = document.createElement('tr');
  if (primary) {
    row.classList.add('primary');
  }
  // Name
  {
    let data = document.createElement('td');
    data.textContent = name;
    data.classList.add('name');
    row.appendChild(data);
  }
  // Value
  {
    let data = document.createElement('td');
    let output = document.createElement('output');
    if (primary) {
      output.innerText = Number(value).toFixed(2);
    } else {
      output.innerText = '---';
    }
    output.classList.add('value');
    data.appendChild(output);
    row.appendChild(data);
  }
  // Key
  {
    let data = document.createElement('td');
    data.classList.add('key');
    let kbd = new InputCode();
    kbd.innerText = key;
    data.appendChild(kbd);
    row.appendChild(data);
  }
  return row;
}

/**
 * @typedef {import('./axisbutton/Button.js').ButtonReadOnly} ButtonReadOnly
 */

const KEYBOARD_SOURCE = Symbol('keyboardSource');
class Keyboard {
  constructor(eventTarget, opts) {
    /** @type {ButtonReadOnly} */
    this.KeyA = new Button();
    /** @type {ButtonReadOnly} */
    this.KeyB = new Button();
    /** @type {ButtonReadOnly} */
    this.KeyC = new Button();
    /** @type {ButtonReadOnly} */
    this.KeyD = new Button();
    /** @type {ButtonReadOnly} */
    this.KeyE = new Button();
    /** @type {ButtonReadOnly} */
    this.KeyF = new Button();
    /** @type {ButtonReadOnly} */
    this.KeyG = new Button();
    /** @type {ButtonReadOnly} */
    this.KeyH = new Button();
    /** @type {ButtonReadOnly} */
    this.KeyI = new Button();
    /** @type {ButtonReadOnly} */
    this.KeyJ = new Button();
    /** @type {ButtonReadOnly} */
    this.KeyK = new Button();
    /** @type {ButtonReadOnly} */
    this.KeyL = new Button();
    /** @type {ButtonReadOnly} */
    this.KeyM = new Button();
    /** @type {ButtonReadOnly} */
    this.KeyN = new Button();
    /** @type {ButtonReadOnly} */
    this.KeyO = new Button();
    /** @type {ButtonReadOnly} */
    this.KeyP = new Button();
    /** @type {ButtonReadOnly} */
    this.KeyQ = new Button();
    /** @type {ButtonReadOnly} */
    this.KeyR = new Button();
    /** @type {ButtonReadOnly} */
    this.KeyS = new Button();
    /** @type {ButtonReadOnly} */
    this.KeyT = new Button();
    /** @type {ButtonReadOnly} */
    this.KeyU = new Button();
    /** @type {ButtonReadOnly} */
    this.KeyV = new Button();
    /** @type {ButtonReadOnly} */
    this.KeyW = new Button();
    /** @type {ButtonReadOnly} */
    this.KeyX = new Button();
    /** @type {ButtonReadOnly} */
    this.KeyY = new Button();
    /** @type {ButtonReadOnly} */
    this.KeyZ = new Button();

    /** @type {ButtonReadOnly} */
    this.Digit0 = new Button();
    /** @type {ButtonReadOnly} */
    this.Digit1 = new Button();
    /** @type {ButtonReadOnly} */
    this.Digit2 = new Button();
    /** @type {ButtonReadOnly} */
    this.Digit3 = new Button();
    /** @type {ButtonReadOnly} */
    this.Digit4 = new Button();
    /** @type {ButtonReadOnly} */
    this.Digit5 = new Button();
    /** @type {ButtonReadOnly} */
    this.Digit6 = new Button();
    /** @type {ButtonReadOnly} */
    this.Digit7 = new Button();
    /** @type {ButtonReadOnly} */
    this.Digit8 = new Button();
    /** @type {ButtonReadOnly} */
    this.Digit9 = new Button();

    /** @type {ButtonReadOnly} */
    this.Minus = new Button();
    /** @type {ButtonReadOnly} */
    this.Equal = new Button();
    /** @type {ButtonReadOnly} */
    this.BracketLeft = new Button();
    /** @type {ButtonReadOnly} */
    this.BracketRight = new Button();
    /** @type {ButtonReadOnly} */
    this.Semicolon = new Button();
    /** @type {ButtonReadOnly} */
    this.Quote = new Button();
    /** @type {ButtonReadOnly} */
    this.Backquote = new Button();
    /** @type {ButtonReadOnly} */
    this.Backslash = new Button();
    /** @type {ButtonReadOnly} */
    this.Comma = new Button();
    /** @type {ButtonReadOnly} */
    this.Period = new Button();
    /** @type {ButtonReadOnly} */
    this.Slash = new Button();

    /** @type {ButtonReadOnly} */
    this.Escape = new Button();
    /** @type {ButtonReadOnly} */
    this.Space = new Button();
    /** @type {ButtonReadOnly} */
    this.CapsLock = new Button();
    /** @type {ButtonReadOnly} */
    this.Backspace = new Button();
    /** @type {ButtonReadOnly} */
    this.Delete = new Button();
    /** @type {ButtonReadOnly} */
    this.Tab = new Button();
    /** @type {ButtonReadOnly} */
    this.Enter = new Button();

    /** @type {ButtonReadOnly} */
    this.ArrowUp = new Button();
    /** @type {ButtonReadOnly} */
    this.ArrowDown = new Button();
    /** @type {ButtonReadOnly} */
    this.ArrowLeft = new Button();
    /** @type {ButtonReadOnly} */
    this.ArrowRight = new Button();

    const deviceName = KEYBOARD;
    const device = new KeyboardDevice(deviceName, eventTarget, opts);
    const bindings = new InputBindings();
    for (let key in this) {
      if (Object.prototype.hasOwnProperty.call(this, key)) {
        let input = this[key];
        bindings.bind(input, deviceName, key);
      }
    }
    const adapter = new DeviceInputAdapter(bindings);
    device.addEventListener('input', adapter.onInput);
    const autopoller = new AutoPoller(adapter);
    autopoller.start();
    this[KEYBOARD_SOURCE] = {
      device,
      bindings,
      adapter,
      autopoller,
    };
  }

  destroy() {
    const source = this[KEYBOARD_SOURCE];
    source.autopoller.stop();
    source.device.removeEventListener('input', source.adapter.onInput);
    source.device.destroy();
    source.bindings.clear();
  }
}

/**
 * @typedef {import('./axisbutton/Axis.js').AxisReadOnly} AxisReadOnly
 * @typedef {import('./axisbutton/Button.js').ButtonReadOnly} ButtonReadOnly
 */

const MOUSE_SOURCE = Symbol('mouseSource');
class Mouse {
  constructor(eventTarget, opts) {
    /** @type {AxisReadOnly} */
    this.PosX = new Axis();
    /** @type {AxisReadOnly} */
    this.PosY = new Axis();

    /** @type {AxisReadOnly} */
    this.WheelX = new Axis();
    /** @type {AxisReadOnly} */
    this.WheelY = new Axis();
    /** @type {AxisReadOnly} */
    this.WheelZ = new Axis();

    /** @type {ButtonReadOnly} */
    this.Button0 = new Button();
    /** @type {ButtonReadOnly} */
    this.Button1 = new Button();
    /** @type {ButtonReadOnly} */
    this.Button2 = new Button();
    /** @type {ButtonReadOnly} */
    this.Button3 = new Button();
    /** @type {ButtonReadOnly} */
    this.Button4 = new Button();

    const deviceName = MOUSE;
    const device = new MouseDevice(deviceName, eventTarget, opts);
    const bindings = new InputBindings();
    for (let key in this) {
      if (Object.prototype.hasOwnProperty.call(this, key)) {
        let input = this[key];
        bindings.bind(input, deviceName, key);
      }
    }
    const adapter = new DeviceInputAdapter(bindings);
    device.addEventListener('input', adapter.onInput);
    const autopoller = new AutoPoller(adapter);
    autopoller.start();
    this[MOUSE_SOURCE] = {
      device,
      bindings,
      adapter,
      autopoller,
    };
  }

  destroy() {
    const source = this[MOUSE_SOURCE];
    source.autopoller.stop();
    source.device.removeEventListener('input', source.adapter.onInput);
    source.device.destroy();
    source.bindings.clear();
  }
}

exports.AutoPoller = AutoPoller;
exports.Axis = Axis;
exports.AxisBinding = AxisBinding;
exports.AxisButtonBinding = AxisButtonBinding;
exports.Button = Button;
exports.ButtonBinding = ButtonBinding;
exports.CLEAR_DOWN_STATE_BITS = CLEAR_DOWN_STATE_BITS;
exports.CLEAR_INVERTED_MODIFIER_BITS = CLEAR_INVERTED_MODIFIER_BITS;
exports.CLEAR_POLL_BITS = CLEAR_POLL_BITS;
exports.DOWN_STATE_BIT = DOWN_STATE_BIT;
exports.DeviceInputAdapter = DeviceInputAdapter;
exports.INVERTED_MODIFIER_BIT = INVERTED_MODIFIER_BIT;
exports.InputBase = InputBase;
exports.InputBindings = InputBindings;
exports.InputCode = InputCode;
exports.InputContext = InputContext;
exports.InputDevice = InputDevice;
exports.InputPort = InputPort;
exports.KeyCodes = KeyCodes;
exports.Keyboard = Keyboard;
exports.KeyboardDevice = KeyboardDevice;
exports.Mouse = Mouse;
exports.MouseDevice = MouseDevice;
exports.PRESSED_STATE_BIT = PRESSED_STATE_BIT;
exports.RELEASED_STATE_BIT = RELEASED_STATE_BIT;
exports.REPEATED_STATE_BIT = REPEATED_STATE_BIT;
exports.stringsToKeyCodes = stringsToKeyCodes;
