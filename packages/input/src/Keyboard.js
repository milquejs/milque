import { Button } from './axisbutton/Button.js';
import { KeyboardDevice } from './device/KeyboardDevice.js';
import { InputBindings } from './InputBindings.js';
import { AutoPoller } from './AutoPoller.js';
import { DeviceInputAdapter } from './DeviceInputAdapter.js';

/**
 * @typedef {import('./axisbutton/Button.js').ButtonReadOnly} ButtonReadOnly
 */

const KEYBOARD_SOURCE = Symbol('keyboardSource');
export class Keyboard
{
    constructor(eventTarget, opts)
    {
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
        
        const deviceName = 'Keyboard';
        const device = new KeyboardDevice(deviceName, eventTarget, opts);
        const bindings = new InputBindings();
        for(let key in this)
        {
            if (Object.prototype.hasOwnProperty.call(this, key))
            {
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

    destroy()
    {
        const source = this[KEYBOARD_SOURCE];
        source.autopoller.stop();
        source.device.removeEventListener('input', source.adapter.onInput);
        source.device.destroy();
        source.bindings.clear();
    }
}
