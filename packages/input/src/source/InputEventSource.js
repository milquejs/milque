import { InputEventCode, InputType, WILDCARD_KEY_MATCHER } from '../device/InputDevice.js';

import { Axis } from './Axis.js';
import { Button } from './Button.js';

/**
 * @readonly
 * @enum {number}
 */
export const InputSourceEventStage = {
    NULL: 0,
    UPDATE: 1,
    POLL: 2,
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
export class InputEventSource
{
    constructor(deviceList)
    {
        /** @private */
        this.onInputEvent = this.onInputEvent.bind(this);
        /** @private */
        this.onAnimationFrame = this.onAnimationFrame.bind(this);

        let deviceMap = {};
        let keyMap = {};
        for(let device of deviceList)
        {
            const deviceName = device.deviceName;
            if (deviceName in deviceMap)
            {
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
            update: [],
        };

        /** @private */
        this._autopoll = false;
        /** @private */
        this._animationFrameHandle = null;
    }

    destroy()
    {
        this.clearKeySources();
        
        for(let deviceName in this.devices)
        {
            let device = this.devices[deviceName];
            device.removeInputListener(WILDCARD_KEY_MATCHER, this.onInputEvent);
            device.destroy();
        }

        this.devices = {};
    }
    
    /**
     * Poll the devices and update the input state.
     */
    poll(now = performance.now())
    {
        for(const deviceName in this.keySources)
        {
            const keyMap = this.keySources[deviceName];
            for(const keyCode in keyMap)
            {
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
    addEventListener(event, listener)
    {
        if (event in this.listeners)
        {
            this.listeners[event].unshift(listener);
        }
        else
        {
            this.listeners[event] = [listener];
        }
    }

    /**
     * Removes the listener from listening to the event.
     * 
     * @param {string} event 
     * @param {InputSourceEventListener} listener 
     */
    removeEventListener(event, listener)
    {
        if (event in this.listeners)
        {
            let list = this.listeners[event];
            let i = list.indexOf(listener);
            list.splice(i, 1);
        }
    }

    /**
     * @param {string} event The event name.
     * @returns {number} The number of active listeners for the event.
     */
    countEventListeners(event)
    {
        if (!(event in this.listeners))
        {
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
    dispatchEvent(eventName, event)
    {
        for(let listener of this.listeners[eventName])
        {
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
    dispatchInputEvent(stage, deviceName, keyCode, input)
    {
        this.dispatchEvent('input', { stage, deviceName, keyCode, input });
    }

    /**
     * @protected
     * @param {number} now The currrent time in milliseconds.
     */
    dispatchPollEvent(now)
    {
        this.dispatchEvent('poll', { now });
    }

    /** @private */
    onInputEvent(e)
    {
        const deviceName = e.deviceName;
        switch(e.type)
        {
            case InputType.KEY:
                {
                    const keyCode = e.keyCode;
                    let button = this.keySources[deviceName][keyCode];
                    if (button)
                    {
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
                    if (xAxis)
                    {
                        xAxis.update(e.x, e.dx);
                        this.dispatchInputEvent(InputSourceEventStage.UPDATE, deviceName, 'PosX', xAxis);
                    }
                    let yAxis = inputs.PosY;
                    if (yAxis)
                    {
                        yAxis.update(e.y, e.dy);
                        this.dispatchInputEvent(InputSourceEventStage.UPDATE, deviceName, 'PosY', yAxis);
                    }
                }
                break;
            case InputType.WHEEL:
                {
                    let inputs = this.keySources[deviceName];
                    let xAxis = inputs.WheelX;
                    if (xAxis)
                    {
                        xAxis.update(e.dx, e.dx);
                        this.dispatchInputEvent(InputSourceEventStage.UPDATE, deviceName, 'WheelX', xAxis);
                    }
                    let yAxis = inputs.WheelY;
                    if (yAxis)
                    {
                        yAxis.update(e.dy, e.dy);
                        this.dispatchInputEvent(InputSourceEventStage.UPDATE, deviceName, 'WheelY', yAxis);
                    }
                    let zAxis = inputs.WheelZ;
                    if (zAxis)
                    {
                        zAxis.update(e.dz, e.dz);
                        this.dispatchInputEvent(InputSourceEventStage.UPDATE, deviceName, 'WheelZ', zAxis);
                    }
                }
                break;
        }
    }
    
    /** @private */
    onAnimationFrame(now)
    {
        if (!this._autopoll) return;
        this._animationFrameHandle = requestAnimationFrame(this.onAnimationFrame);
        this.poll(now);
    }

    set autopoll(value)
    {
        this._autopoll = value;

        if (this._animationFrameHandle)
        {
            // Stop animation frame loop
            cancelAnimationFrame(this._animationFrameHandle);
            this._animationFrameHandle = null;
        }

        if (value)
        {
            // Start animation frame loop
            this._animationFrameHandle = requestAnimationFrame(this.onAnimationFrame);
        }
    }

    /** @returns {boolean} Whether to automatically poll on animation frame. */
    get autopoll()
    {
        return this._autopoll;
    }
    
    /**
     * Add an input for the given device and key code.
     * 
     * @param {String} deviceName 
     * @param {String} keyCode 
     */
    addKeySource(deviceName, keyCode)
    {
        if (!(deviceName in this.devices))
        {
            throw new Error('Invalid device name - missing device with name in source.');
        }

        let device = this.devices[deviceName];
        let result;
        if (device.constructor.isAxis(keyCode))
        {
            result = new Axis();
        }
        else if (device.constructor.isButton(keyCode))
        {
            result = new Button();
        }
        else
        {
            throw new Error(`Unknown key code '${keyCode}' for device ${deviceName}.`);
        }

        let prev = this.keySources[deviceName][keyCode];
        if (prev)
        {
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
    deleteKeySource(deviceName, keyCode)
    {
        let prev = this.keySources[deviceName][keyCode];
        if (!prev)
        {
            throw new Error('Cannot delete missing key source for the device and key code.');
        }
        delete this.keySources[deviceName][keyCode];
    }

    /** @returns {Button|Axis} */
    getKeySource(deviceName, keyCode)
    {
        return this.keySources[deviceName][keyCode];
    }
    
    /**
     * @param {String} deviceName 
     * @param {String} keyCode 
     * @returns {Boolean} Whether the device and key code has been added.
     */
    hasKeySource(deviceName, keyCode)
    {
        return deviceName in this.keySources && keyCode in this.keySources[deviceName];
    }

    /**
     * Removes all registered inputs from all devices.
     */
    clearKeySources()
    {
        for(let deviceName in this.devices)
        {
            this.keySources[deviceName] = {};
        }
    }
}
