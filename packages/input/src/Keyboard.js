import { ButtonState } from './axisbutton/ButtonState.js';
import { KeyboardDevice } from './device/KeyboardDevice.js';
import { InputBindings } from './InputBindings.js';
import { AutoPoller } from './AutoPoller.js';
import { DeviceInputAdapter } from './DeviceInputAdapter.js';
import { KEYBOARD } from './keycode/KeyCodes.js';

/**
 * @typedef {import('./axisbutton/ButtonState.js').ButtonReadOnly} ButtonReadOnly
 */

const KEYBOARD_SOURCE = Symbol('keyboardSource');
export class Keyboard {
  constructor(eventTarget, opts) {
    /** @type {ButtonReadOnly} */
    this.KeyA = new ButtonState();
    /** @type {ButtonReadOnly} */
    this.KeyB = new ButtonState();
    /** @type {ButtonReadOnly} */
    this.KeyC = new ButtonState();
    /** @type {ButtonReadOnly} */
    this.KeyD = new ButtonState();
    /** @type {ButtonReadOnly} */
    this.KeyE = new ButtonState();
    /** @type {ButtonReadOnly} */
    this.KeyF = new ButtonState();
    /** @type {ButtonReadOnly} */
    this.KeyG = new ButtonState();
    /** @type {ButtonReadOnly} */
    this.KeyH = new ButtonState();
    /** @type {ButtonReadOnly} */
    this.KeyI = new ButtonState();
    /** @type {ButtonReadOnly} */
    this.KeyJ = new ButtonState();
    /** @type {ButtonReadOnly} */
    this.KeyK = new ButtonState();
    /** @type {ButtonReadOnly} */
    this.KeyL = new ButtonState();
    /** @type {ButtonReadOnly} */
    this.KeyM = new ButtonState();
    /** @type {ButtonReadOnly} */
    this.KeyN = new ButtonState();
    /** @type {ButtonReadOnly} */
    this.KeyO = new ButtonState();
    /** @type {ButtonReadOnly} */
    this.KeyP = new ButtonState();
    /** @type {ButtonReadOnly} */
    this.KeyQ = new ButtonState();
    /** @type {ButtonReadOnly} */
    this.KeyR = new ButtonState();
    /** @type {ButtonReadOnly} */
    this.KeyS = new ButtonState();
    /** @type {ButtonReadOnly} */
    this.KeyT = new ButtonState();
    /** @type {ButtonReadOnly} */
    this.KeyU = new ButtonState();
    /** @type {ButtonReadOnly} */
    this.KeyV = new ButtonState();
    /** @type {ButtonReadOnly} */
    this.KeyW = new ButtonState();
    /** @type {ButtonReadOnly} */
    this.KeyX = new ButtonState();
    /** @type {ButtonReadOnly} */
    this.KeyY = new ButtonState();
    /** @type {ButtonReadOnly} */
    this.KeyZ = new ButtonState();

    /** @type {ButtonReadOnly} */
    this.Digit0 = new ButtonState();
    /** @type {ButtonReadOnly} */
    this.Digit1 = new ButtonState();
    /** @type {ButtonReadOnly} */
    this.Digit2 = new ButtonState();
    /** @type {ButtonReadOnly} */
    this.Digit3 = new ButtonState();
    /** @type {ButtonReadOnly} */
    this.Digit4 = new ButtonState();
    /** @type {ButtonReadOnly} */
    this.Digit5 = new ButtonState();
    /** @type {ButtonReadOnly} */
    this.Digit6 = new ButtonState();
    /** @type {ButtonReadOnly} */
    this.Digit7 = new ButtonState();
    /** @type {ButtonReadOnly} */
    this.Digit8 = new ButtonState();
    /** @type {ButtonReadOnly} */
    this.Digit9 = new ButtonState();

    /** @type {ButtonReadOnly} */
    this.Minus = new ButtonState();
    /** @type {ButtonReadOnly} */
    this.Equal = new ButtonState();
    /** @type {ButtonReadOnly} */
    this.BracketLeft = new ButtonState();
    /** @type {ButtonReadOnly} */
    this.BracketRight = new ButtonState();
    /** @type {ButtonReadOnly} */
    this.Semicolon = new ButtonState();
    /** @type {ButtonReadOnly} */
    this.Quote = new ButtonState();
    /** @type {ButtonReadOnly} */
    this.Backquote = new ButtonState();
    /** @type {ButtonReadOnly} */
    this.Backslash = new ButtonState();
    /** @type {ButtonReadOnly} */
    this.Comma = new ButtonState();
    /** @type {ButtonReadOnly} */
    this.Period = new ButtonState();
    /** @type {ButtonReadOnly} */
    this.Slash = new ButtonState();

    /** @type {ButtonReadOnly} */
    this.Escape = new ButtonState();
    /** @type {ButtonReadOnly} */
    this.Space = new ButtonState();
    /** @type {ButtonReadOnly} */
    this.CapsLock = new ButtonState();
    /** @type {ButtonReadOnly} */
    this.Backspace = new ButtonState();
    /** @type {ButtonReadOnly} */
    this.Delete = new ButtonState();
    /** @type {ButtonReadOnly} */
    this.Tab = new ButtonState();
    /** @type {ButtonReadOnly} */
    this.Enter = new ButtonState();

    /** @type {ButtonReadOnly} */
    this.ArrowUp = new ButtonState();
    /** @type {ButtonReadOnly} */
    this.ArrowDown = new ButtonState();
    /** @type {ButtonReadOnly} */
    this.ArrowLeft = new ButtonState();
    /** @type {ButtonReadOnly} */
    this.ArrowRight = new ButtonState();

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
    // @ts-ignore
    device.addEventListener('input', adapter.onInput);
    // @ts-ignore
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
    // @ts-ignore
    source.device.removeEventListener('input', source.adapter.onInput);
    source.device.destroy();
    source.bindings.clear();
  }
}
