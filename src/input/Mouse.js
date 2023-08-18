import { AutoPoller } from './AutoPoller.js';
import { DeviceInputAdapter } from './DeviceInputAdapter.js';
import { InputBindings } from './InputBindings.js';
import { MouseDevice } from './device/MouseDevice.js';
import { MOUSE } from './keycode/KeyCodes.js';
import { AxisState } from './state/AxisState.js';
import { ButtonState } from './state/ButtonState.js';

/**
 * @typedef {import('./state/AxisState.js').AxisReadOnly} AxisReadOnly
 * @typedef {import('./state/ButtonState.js').ButtonReadOnly} ButtonReadOnly
 */

const MOUSE_SOURCE = Symbol('mouseSource');
export class Mouse {
  constructor(eventTarget, opts) {
    /** @type {AxisReadOnly} */
    this.PosX = new AxisState();
    /** @type {AxisReadOnly} */
    this.PosY = new AxisState();

    /** @type {AxisReadOnly} */
    this.WheelX = new AxisState();
    /** @type {AxisReadOnly} */
    this.WheelY = new AxisState();
    /** @type {AxisReadOnly} */
    this.WheelZ = new AxisState();

    /** @type {ButtonReadOnly} */
    this.Button0 = new ButtonState();
    /** @type {ButtonReadOnly} */
    this.Button1 = new ButtonState();
    /** @type {ButtonReadOnly} */
    this.Button2 = new ButtonState();
    /** @type {ButtonReadOnly} */
    this.Button3 = new ButtonState();
    /** @type {ButtonReadOnly} */
    this.Button4 = new ButtonState();

    const deviceName = MOUSE;
    const device = new MouseDevice(deviceName, eventTarget, opts);
    const bindings = new InputBindings();
    for (let key in this) {
      if (Object.prototype.hasOwnProperty.call(this, key)) {
        let input = /** @type {AxisState|ButtonState} */ (this[key]);
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