import {
  InputEventCode,
  InputType,
  WILDCARD_KEY_MATCHER,
} from '../device/InputDevice.js';
import { Keyboard } from '../device/Keyboard.js';
import { Mouse } from '../device/Mouse.js';

import { Axis } from './Axis.js';
import { Button } from './Button.js';

/**
 * @readonly
 * @enum {Number}
 */
export const InputSourceStage = {
  NULL: 0,
  UPDATE: 1,
  POLL: 2,
};

/**
 * Whether the given key code for device is an axis input.
 *
 * @param {String} deviceName
 * @param {String} keyCode
 */
export function isInputAxis(deviceName, keyCode) {
  return (
    deviceName === 'Mouse' &&
    (keyCode === 'PosX' ||
      keyCode === 'PosY' ||
      keyCode === 'ScrollX' ||
      keyCode === 'ScrollY' ||
      keyCode === 'ScrollZ')
  );
}

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
export class InputSource {
  static from(eventTarget) {
    return new InputSource([
      new Keyboard(eventTarget),
      new Mouse(eventTarget.canvas || eventTarget),
    ]);
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
      update: [],
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
    this.dispatchEvent('input', { stage, deviceName, keyCode, input });
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
        this._dispatchInputEvent(
          InputSourceStage.POLL,
          deviceName,
          keyCode,
          input
        );
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
            this._dispatchInputEvent(
              InputSourceStage.UPDATE,
              deviceName,
              keyCode,
              button
            );
          }
        }
        break;
      case InputType.POS:
        {
          let inputs = this.inputs[deviceName];
          let xAxis = inputs.PosX;
          if (xAxis) {
            xAxis.update(e.x, e.dx);
            this._dispatchInputEvent(
              InputSourceStage.UPDATE,
              deviceName,
              'PosX',
              xAxis
            );
          }
          let yAxis = inputs.PosY;
          if (yAxis) {
            yAxis.update(e.y, e.dy);
            this._dispatchInputEvent(
              InputSourceStage.UPDATE,
              deviceName,
              'PosY',
              yAxis
            );
          }
        }
        break;
      case InputType.WHEEL:
        {
          let inputs = this.inputs[deviceName];
          let xAxis = inputs.ScrollX;
          if (xAxis) {
            xAxis.update(e.dx, e.dx);
            this._dispatchInputEvent(
              InputSourceStage.UPDATE,
              deviceName,
              'ScrollX',
              xAxis
            );
          }
          let yAxis = inputs.ScrollY;
          if (yAxis) {
            yAxis.update(e.dy, e.dy);
            this._dispatchInputEvent(
              InputSourceStage.UPDATE,
              deviceName,
              'ScrollY',
              yAxis
            );
          }
          let zAxis = inputs.ScrollZ;
          if (zAxis) {
            zAxis.update(e.dz, e.dz);
            this._dispatchInputEvent(
              InputSourceStage.UPDATE,
              deviceName,
              'ScrollZ',
              zAxis
            );
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
      throw new Error(
        'Invalid device name - missing device with name in source.'
      );
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
