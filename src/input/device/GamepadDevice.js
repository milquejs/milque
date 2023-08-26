import { InputDevice, InputDeviceEvent } from './InputDevice.js';

/**
 * A class that listens to the gamepad events from the event target and
 * transforms the events into a valid {@link InputDeviceEvent} for its
 * listeners.
 *
 * - Axis0
 * - Axis1
 * - Axis2
 * - Axis3
 * - Button0
 * - Button1
 * - Button2
 * - Button3
 * - Button4
 * - Button5
 * - Button6
 * - Button7
 * - Button8
 * - Button9
 * - Button10
 * - Button11
 * - Button12
 * - Button13
 * - Button14
 * - Button15
 * - Button16
 */
export class GamepadDevice extends InputDevice {

  /**
   * Constructs a listening gamepad with no listeners (yet).
   *
   * @param {string} deviceName
   * @param {EventTarget} eventTarget
   * @param {Object} [opts] Any additional options.
   */
  constructor(deviceName, eventTarget, opts = {}) {
    super(deviceName, eventTarget);

    const {} = opts;

    /** @private */
    this.onGamepadConnectionChanged = this.onGamepadConnectionChanged.bind(this);
    
    /** @private */
    this.pollEvent = new InputDeviceEvent('input', this.name, '', '');

    /** @private */
    this.connector = new GamepadConnector(this.onGamepadConnectionChanged);
    this.connector.connect();
  }

  /**
   * @override
   * @param {EventTarget} eventTarget
   */
  setEventTarget(eventTarget) {
    super.setEventTarget(eventTarget);
    this.connector.connect();
    return this;
  }

  /** @override */
  destroy() {
    this.connector.disconnect();
    super.destroy();
  }

  /**
   * 
   * @param {number} gamepadIndex 
   * @param {number} hapticIndex 
   * @param {GamepadHapticEffectType} effectType 
   * @param {GamepadEffectParameters} effectParams 
   */
  async actuateHaptics(gamepadIndex, hapticIndex, effectType, effectParams) {
    const gamepads = this.connector.getGamepads();
    const gamepad = gamepads[gamepadIndex];
    if (!gamepad) {
      throw new Error(`No connected gamepad found at index '${gamepadIndex}'.`);
    }
    if (Array.isArray(gamepad.hapticActuators)) {
      const actuator = gamepad.hapticActuators[hapticIndex];
      return actuator.playEffect(effectType, effectParams);
    } else if (Array.isArray(gamepad.vibrationActuator)) {
      const actuator = gamepad.vibrationActuator[hapticIndex];
      return actuator.playEffect(effectType, effectParams);
    } else if (gamepad.vibrationActuator?.playEffect) {
      const actuator = gamepad.vibrationActuator;
      return actuator.playEffect(effectType, effectParams);
    } else {
      throw new Error('No haptics supported for browser.');
    }
  }

  /**
   * @override
   * @param {number} [now] 
   */
  poll(now = performance.now()) {
    for(let gamepad of this.connector.getGamepads()) {
      if (!gamepad) {
        continue;
      }
      let event = new InputDeviceEvent('input')
      for(let i = 0; i < gamepad.axes.length; ++i) {
        let axis = gamepad.axes[i];
        event.initInputDeviceEvent(`Axis${i}`, 'moved', axis, 0, false, false, false, false, gamepad.index);
        this.dispatchEvent(event);
      }
      for(let i = 0; i < gamepad.buttons.length; ++i) {
        let button = gamepad.buttons[i];
        event.initInputDeviceEvent(`Axis${i}`, 'pressed', button.pressed ? 1 : 0, 0, false, false, false, false, gamepad.index);
        this.dispatchEvent(event);
        event.initInputDeviceEvent(`Axis${i}`, 'touched', button.touched ? 1 : 0, 0, false, false, false, false, gamepad.index);
        this.dispatchEvent(event);
        event.initInputDeviceEvent(`Axis${i}`, 'moved', button.value, 0, false, false, false, false, gamepad.index);
        this.dispatchEvent(event);
      }
    }
  }

  /**
   * @private
   * @param {number} index
   * @param {boolean} connected
   */
  onGamepadConnectionChanged(index, connected) {
    if (connected) {
      const event = new InputDeviceEvent('input', this.name, 'Connection', 'connected', {
        value: 1,
        index: index,
      });
      this.dispatchEvent(event);
    } else {
      const event = new InputDeviceEvent('input', this.name, 'Connection', 'disconnected', {
        value: 0,
        index: index,
      });
      this.dispatchEvent(event);
    }
  }
}

/**
 * For Chrome, `gamepadconnected` events don't exist. We must
 * poll ourselves. The event target is usually the global `window`
 * object.
 * 
 * @param {EventTarget} eventTarget
 */
export function isGamepadConnectedEventSupported(eventTarget) {
  return 'ongamepadconnected' in eventTarget;
}

export class GamepadConnector {

  /**
   * @private
   * @type {EventTarget|null}
   */
  eventTarget = null;

  /**
   * @private
   * @type {Array<boolean>}
   */
  connected = [];

  /**
   * @private
   * @type {number}
   */
  intervalHandle = 0;

  /**
   * @param {(index: number, connected: boolean) => void} handler 
   */
  constructor(handler) {
    /** @private */
    this.handler = handler;
    /** @private */
    this.onInterval = this.onInterval.bind(this);
    /** @private */
    this.onGamepadConnected = this.onGamepadConnected.bind(this);
    /** @private */
    this.onGamepadDisconnected = this.onGamepadDisconnected.bind(this);
  }

  /**
   * @param {EventTarget} [eventTarget] 
   */
  connect(eventTarget = window) {
    if (this.eventTarget) {
      this.disconnect();
    }
    this.eventTarget = eventTarget;
    if (!isGamepadConnectedEventSupported(this.eventTarget)) {
      this.intervalHandle = window.setInterval(this.onInterval, 500);
    } else {
      // @ts-ignore
      this.eventTarget.addEventListener('gamepadconnected', this.onGamepadConnected);
      // @ts-ignore
      this.eventTarget.addEventListener('gamepaddisconnected', this.onGamepadDisconnected);
    }
  }

  disconnect() {
    window.clearInterval(this.intervalHandle);
    if (this.eventTarget) {
      // @ts-ignore
      this.eventTarget.removeEventListener('gamepadconnected', this.onGamepadConnected);
      // @ts-ignore
      this.eventTarget.removeEventListener('gamepaddisconnected', this.onGamepadDisconnected);
    }
    this.intervalHandle = 0;
    this.eventTarget = null;
  }

  /** @private */
  onInterval() {
    const gamepads = navigator.getGamepads();
    for(let i = 0; i < gamepads.length; ++i) {
      const gamepad = gamepads[i];
      const result = gamepad !== null && gamepad.connected;
      if (this.connected[i] !== result) {
        this.connected[i] = result;
        this.handler(i, result);
      }
    }
  }

  /**
   * @private
   * @param {GamepadEvent} e 
   */
  onGamepadConnected(e) {
    const index = e.gamepad.index;
    this.connected[index] = true;
    this.handler(index, true);
  }

  /**
   * @private
   * @param {GamepadEvent} e 
   */
  onGamepadDisconnected(e) {
    const index = e.gamepad.index;
    this.connected[index] = false;
    this.handler(index, false);
  }

  /**
   * @param {number} index
   */
  isConnected(index) {
    return this.connected[index];
  }

  getGamepads() {
    return navigator.getGamepads();
  }
}
