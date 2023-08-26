import { KeyboardDevice } from '../device/KeyboardDevice';
import { GamepadDevice } from '../device/GamepadDevice';
import { MouseDevice } from '../device/MouseDevice';
import { AxisState } from './AxisState';
import { ButtonState } from './ButtonState';
import { DeviceCodes, isKeyModifier } from '../keycode';

export class AxisButtonInputContext2 {

  /**
   * @param {EventTarget} eventTarget 
   */
  constructor(eventTarget) {
    this.canvas = eventTarget;
    this.devices = [
      new MouseDevice(DeviceCodes.MOUSE, eventTarget),
      new KeyboardDevice(DeviceCodes.KEYBOARD, eventTarget),
      new GamepadDevice(DeviceCodes.GAMEPAD, eventTarget),
    ];

    this.axes = new AxisState(0);
    this.buttons = new ButtonState(0);

    this.nextAxes = new AxisState(0);
    this.nextButtons = new ButtonState(0);

    /** @type {Record<string, AxisButtonInputMapping>} */
    this.mapping = {};
    /** @type {Record<string, Record<string, { type: string, index: number, key: import('../keycode/KeyCode').KeyCode }>>} */
    this.binding = {};
  }

  poll(now = performance.now()) {
    this.nextAxes.next(this.axes, now);
    this.nextButtons.next(this.buttons, now);
  }

  /**
   * @param {string} deviceName
   */
  getDevice(deviceName) {
    return this.devices.find(device => device.name === deviceName);
  }

  /**
   * @param {string} name 
   * @param {Array<import('../keycode/KeyCode').KeyCode>} keyCodes
   * @param {object} opts 
   */
  register(name, keyCodes, opts) {
    let ranges = [];
    let states = [];
    let axisIndex = this.axes.size;
    let buttonIndex = this.buttons.size;
    for(let keyCode of keyCodes) {
      if (keyCode.type === 'range') {
        let i = this.resolveBindingIndex(keyCode, axisIndex);
        axisIndex = Math.max(i, axisIndex);
        ranges.push(keyCode);
      } else if (keyCode.type === 'state') {
        let i = this.resolveBindingIndex(keyCode, buttonIndex);
        buttonIndex = Math.max(i, buttonIndex);
        states.push(keyCode);
      } else {
        throw new Error(`Cannot register unknown key code type '${keyCode.type}' for input '${name}'.`);
      }
    }
    if (axisIndex > this.axes.size) {
      this.axes.resize(axisIndex);
    }
    if (buttonIndex > this.buttons.size) {
      this.buttons.resize(buttonIndex);
    }
    this.mapping[name] = new AxisButtonInputMapping(name, ranges, states, opts);
    return this;
  }

  /**
   * @param {import('../keycode/KeyCode').KeyCode} keyCode
   * @param {number} index
   */
  resolveBindingIndex(keyCode, index) {
    let deviceMap = this.binding[keyCode.device];
    if (!(keyCode.device in this.binding)) {
      deviceMap = {};
      this.binding[keyCode.device] = deviceMap;
    }
    if (!(keyCode.code in deviceMap)) {
      deviceMap[keyCode.code] = {
        type: keyCode.type,
        index: index + 1,
        key: keyCode,
      };
      return index + 1;
    } else {
      return deviceMap[keyCode.code].index;
    }
  }

  /**
   * @param {Array<import('../binding/AxisBinding').AxisBinding|import('../binding/ButtonBinding').ButtonBinding>} bindings 
   */
  registerBindings(bindings) {
    let axisIndex = this.axes.size;
    let buttonIndex = this.buttons.size;
    for(let binding of bindings) {
      const { name, keyCodes, opts } = binding;
      let ranges = [];
      let states = [];
      for(let keyCode of keyCodes) {
        if (keyCode.type === 'range') {
          let i = this.resolveBindingIndex(keyCode, axisIndex);
          axisIndex = Math.max(i, axisIndex);
          ranges.push(keyCode);
        } else if (keyCode.type === 'state') {
          let i = this.resolveBindingIndex(keyCode, buttonIndex);
          buttonIndex = Math.max(i, buttonIndex);
          states.push(keyCode);
        } else {
          throw new Error(`Cannot register unknown key code type '${keyCode.type}' for input '${name}'.`);
        }
      }
      this.mapping[name] = new AxisButtonInputMapping(name, ranges, states, opts);
    }
    if (axisIndex > this.axes.size) {
      this.axes.resize(axisIndex);
    }
    if (buttonIndex > this.buttons.size) {
      this.buttons.resize(buttonIndex);
    }
    return this;
  }

  /**
   * @param {string} name
   */
  has(name) {
    return name in this.mapping;
  }

  /**
   * Get the axis position.
   * 
   * @param {string} name
   */
  axis(name) {
    const { ranges } = this.mapping[name];
    const axisCount = ranges.length;
    if (axisCount <= 0) {
      throw new Error(`Cannot get axis values for input '${name}' - does not have range-type key codes.`);
    }
    let result = 0;
    for(let range of ranges) {
      let i = this.resolveBindingIndex(range, -1);
      let value = this.axes.valueOf(i);
      result = aggregateAxis(range, result, value);
    }
    return result;
  }

  /**
   * Get the axis change since last frame.
   * 
   * @param {string} name
   */
  axisDelta(name) {
    const { ranges } = this.mapping[name];
    const axisCount = ranges.length;
    if (axisCount <= 0) {
      throw new Error(`Cannot get axis values for input '${name}' - does not have range-type key codes.`);
    }
    let result = 0;
    for(let key of ranges) {
      let i = this.resolveBindingIndex(key, -1);
      let value = this.axes.deltaOf(i);
      result = aggregateAxis(key, result, value);
    }
    return result;
  }

  /**
   * Returns truthy, positive non-zero if this button is down (until released).
   * 
   * @param {string} name
   */
  button(name) {
    const { states } = this.mapping[name];
    const buttonCount = states.length;
    if (buttonCount <= 0) {
      throw new Error(`Cannot get button values for input '${name}' - does not have state-type key codes.`);
    }
    let result = 0;
    for(let key of states) {
      let i = this.resolveBindingIndex(key, -1);
      let value = this.buttons.valueOf(i);
      result = aggregateAxis(key, result, value);
    }
    return result;
  }

  /**
   * Returns true if this button was just pressed from up.
   * 
   * @param {string} name
   */
  buttonPressed(name) {
    const { states } = this.mapping[name];
    const buttonCount = states.length;
    if (buttonCount <= 0) {
      throw new Error(`Cannot get button values for input '${name}' - does not have state-type key codes.`);
    }
    let result = false;
    for(let key of states) {
      let i = this.resolveBindingIndex(key, -1);
      let value = this.buttons.pressedOf(i);
      result = aggregateButton(key, result, value);
    }
    return result;
  }

  /**
   * Returns true if this button was just released from down.
   * 
   * @param {string} name
   */
  buttonReleased(name) {
    const { states } = this.mapping[name];
    const buttonCount = states.length;
    if (buttonCount <= 0) {
      throw new Error(`Cannot get button values for input '${name}' - does not have state-type key codes.`);
    }
    let result = false;
    for(let key of states) {
      let i = this.resolveBindingIndex(key, -1);
      let value = this.buttons.releasedOf(i);
      result = aggregateButton(key, result, value);
    }
    return result;
  }

  /**
   * Returns true if this button was down (until released).
   * 
   * @param {string} name
   */
  buttonDown(name) {
    const { states } = this.mapping[name];
    const buttonCount = states.length;
    if (buttonCount <= 0) {
      throw new Error(`Cannot get button values for input '${name}' - does not have state-type key codes.`);
    }
    let result = false;
    for(let key of states) {
      let i = this.resolveBindingIndex(key, -1);
      let value = this.buttons.downOf(i);
      result = aggregateButton(key, result, value);
    }
    return result;
  }

  /**
   * If enabled, returns true if this button pressed was repeated.
   * 
   * @param {string} name
   */
  buttonRepeated(name) {
    const { states } = this.mapping[name];
    const buttonCount = states.length;
    if (buttonCount <= 0) {
      throw new Error(`Cannot get button values for input '${name}' - does not have state-type key codes.`);
    }
    let result = false;
    for(let key of states) {
      let i = this.resolveBindingIndex(key, -1);
      let value = this.buttons.repeatedOf(i);
      result = aggregateButton(key, result, value);
    }
    return result;
  }

  /**
   * If supported, returns true if the button was touched.
   * 
   * @param {string} name
   */
  buttonTouched(name) {
    const { states } = this.mapping[name];
    const buttonCount = states.length;
    if (buttonCount <= 0) {
      throw new Error(`Cannot get button values for input '${name}' - does not have state-type key codes.`);
    }
    let result = false;
    for(let key of states) {
      let i = this.resolveBindingIndex(key, -1);
      let value = this.buttons.touchedOf(i);
      result = aggregateButton(key, result, value);
    }
    return result;
  }

  /**
   * @param {import('../device/InputDevice').InputDeviceEvent} e 
   * @returns 
   */
  onInput(e) {
    const {
      device,
      code,
      event,
      value,
      movement,
      control,
      shift,
      alt,
      repeat,
      deviceIndex,
    } = e;
    if (!(device in this.binding) || !(code in this.binding[device])) {
      return;
    }
    const { key, index } = this.binding[device][code];
    switch (key.type) {
      case 'range':
        switch (event) {
          case 'wheel':
            this.axes.applyChange(index, movement);
            break;
          case 'moved':
            this.axes.applyMovement(index, value, movement);
            break;
          default:
            throw new Error(`Unknown range-type key code event '${event}'.`);
        }
        break;
      case 'state':
        switch (event) {
          case 'connected':
          case 'pressed':
            this.buttons.applyPressed(index, repeat);
            break;
          case 'disconnected':
          case 'released':
            this.buttons.applyReleased(index);
            break;
          case 'touched':
            this.buttons.applyTouched(index, value > 0);
            break;
          default:
            throw new Error(`Unknown state-type key code event '${event}'.`);
        }
        break;
      default:
        throw new Error(`Unknown key code type '${key.type}'.`);
    }
  }

  onPoll() {
    const deviceMap = this.binding[DeviceCodes.GAMEPAD];
    for(const { key, index } of Object.values(deviceMap)) {
      switch (key.type) {
        case 'range':
          for(const gamepad of navigator.getGamepads()) {
            if (!gamepad) {
              continue;
            }
            const gamepadAxisIndex = Number(key.code.substring('Axis'.length));
            const gamepadAxis = gamepad.axes[gamepadAxisIndex];
            this.axes.applyValue(index, gamepadAxis);
          }
          break;
        case 'state':
          for(const gamepad of navigator.getGamepads()) {
            if (!gamepad) {
              continue;
            }
            const gamepadButtonIndex = Number(key.code.substring('Button'.length));
            const gamepadButton = gamepad.buttons[gamepadButtonIndex];
            this.buttons.applyDown(index, gamepadButton.pressed);
            this.buttons.applyTouched(index, gamepadButton.touched);
            // TODO: button.value is an analog value (like newer bumpers)
          }
          break;
        default:
          throw new Error(`Unknown key code type '${key.type}'.`);
      }
    }
  }
}


/**
 * @param {import('../keycode/KeyCode').KeyCode|import('../keycode/KeyModifier').KeyModifier} keyOrMod 
 * @param {number} prev 
 * @param {number} value
 */
function aggregateAxis(keyOrMod, prev, value) {
  if (isKeyModifier(keyOrMod)) {
    const { key, mod } = /** @type {import('../keycode/KeyModifier').KeyModifier} */ (keyOrMod);
    return mod.transform(key, prev, value);
  } else {
    return prev + value;
  }
}

/**
 * @param {import('../keycode/KeyCode').KeyCode|import('../keycode/KeyModifier').KeyModifier} keyOrMod 
 * @param {boolean} prev 
 * @param {boolean} value
 */
function aggregateButton(keyOrMod, prev, value) {
  if (isKeyModifier(keyOrMod)) {
    const { key, mod } = /** @type {import('../keycode/KeyModifier').KeyModifier} */ (keyOrMod);
    return mod.transform(key, prev ? 1 : 0, value ? 1 : 0) >= 0.5;
  } else {
    return prev || value;
  }
}

class AxisButtonInputMapping {
  /**
   * @param {string} name 
   * @param {Array<import('../keycode/KeyCode').KeyCode>} ranges 
   * @param {Array<import('../keycode/KeyCode').KeyCode>} states 
   * @param {object} [opts] 
   */
  constructor(name, ranges, states, opts) {
    this.name = name;
    this.ranges = ranges;
    this.states = states;
    this.opts = opts;
  }
}

/**
 * Transforms all events and states into Axis or Button triggers.
 */
class AxisButtonAdapter {
  /**
   * @param {string} device 
   * @param {number} deviceIndex 
   * @param {string} code 
   * @param {string} event 
   * @param {object} [opts] 
   * @param {number} [opts.value]
   * @param {number} [opts.movement]
   * @param {boolean} [opts.control]
   * @param {boolean} [opts.shift]
   * @param {boolean} [opts.alt]
   */
  transform(device, deviceIndex, code, event, opts) {
  }
}

class AxisBinding {
  constructor(name, keyCodes, opts) {
    this.indices = [];
  }
  value(axb) {}
  delta(axb) {}
}

class ButtonBinding {
  /**
   * 
   * @param {string} name 
   * @param {import('../keycode/KeyCode').KeyCode|Array<import('../keycode/KeyCode').KeyCode>} keyCodes 
   * @param {object} opts 
   */
  constructor(name, keyCodes, opts) {
    this.name = name;
    /** @type {Array<import('../keycode/KeyCode').KeyCode>} */
    this.keyCodes = !Array.isArray(keyCodes) ? [keyCodes] : keyCodes;
    this.opts = opts;
  }

  /**
   * @param {AxisButtonInputContext2} axb
   */
  value(axb) {
    if (!axb.has(this.name)) {
      axb.register(this.name, this.keyCodes, this.opts);
    }
    return axb.button(this.name);
  }

  /**
   * @param {AxisButtonInputContext2} axb
   */
  down(axb) {
    if (!axb.has(this.name)) {
      axb.register(this.name, this.keyCodes, this.opts);
    }
    return axb.buttonDown(this.name);
  }

  /**
   * @param {AxisButtonInputContext2} axb
   */
  up(axb) {
    return !this.down(axb);
  }

  /**
   * @param {AxisButtonInputContext2} axb
   */
  pressed(axb) {
    if (!axb.has(this.name)) {
      axb.register(this.name, this.keyCodes, this.opts);
    }
    return axb.buttonPressed(this.name);
  }

  /**
   * @param {AxisButtonInputContext2} axb
   */
  released(axb) {
    if (!axb.has(this.name)) {
      axb.register(this.name, this.keyCodes, this.opts);
    }
    return axb.buttonReleased(this.name);
  }

  /**
   * @param {AxisButtonInputContext2} axb
   */
  repeated(axb) {
    if (!axb.has(this.name)) {
      axb.register(this.name, this.keyCodes, this.opts);
    }
    return axb.buttonRepeated(this.name);
  }

  /**
   * @param {AxisButtonInputContext2} axb
   */
  touched(axb) {
    if (!axb.has(this.name)) {
      axb.register(this.name, this.keyCodes, this.opts);
    }
    return axb.buttonTouched(this.name);
  }
}

class AxisButtonBinding extends AxisBinding {
  constructor(name, positiveKeyCodes, negativeKeyCodes, opts) {
    super(name, positiveKeyCodes, opts);
    this.negated = [];
  }
}

// Axis -> AxisState -> Map<> -> Input -> Event -> Device -> SystemEvent

// Binding is a STATIC map from intent to triggers.
// - All inputs can be classified into 2 trigger types: Axis / Button
// Context is the interaction point to access trigger values.
// - This is expected to live a long time and be distributed.
// Mapping is from trigger index to key codes.
// - This is what determines what state turns into intent.
// State converts all EVENT-based into POLL-based inputs.
// - Updated and accessed every frame. Can be flushed or manipulated for testing.
// - This is the breadboard.
// Device is a source map of system-specific to standard inputs.
// - Can add new ones (such as Gamepad)

class AnyBinding {
  anyButton = new ButtonState(1);
  anyButtonDevice = '';
  anyButtonCode = '';
  anyAxis = new AxisState(1);
  anyAxisDevice = '';
  anyAxisCode = '';
}
