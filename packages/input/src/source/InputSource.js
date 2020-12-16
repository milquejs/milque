import { InputEventCode, InputType, WILDCARD_KEY_MATCHER } from '../device/InputDevice.js';
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
export function isInputAxis(deviceName, keyCode)
{
    return deviceName === 'Mouse'
        && (keyCode === 'PosX'
        || keyCode === 'PosY'
        || keyCode === 'WheelX'
        || keyCode === 'WheelY'
        || keyCode === 'WheelZ');
}

/** This determines whether an element has an associated input source. */
const INPUT_SOURCE_REF_KEY = Symbol('inputSource');

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
export class InputSource
{
    static for(eventTarget)
    {
        if (Object.prototype.hasOwnProperty.call(eventTarget, INPUT_SOURCE_REF_KEY))
        {
            return eventTarget[INPUT_SOURCE_REF_KEY];
        }
        else
        {
            let result = new InputSource([
                new Keyboard(eventTarget),
                new Mouse(eventTarget),
            ]);
            Object.defineProperty(eventTarget, INPUT_SOURCE_REF_KEY, { value: result });
            return result;
        }
    }

    constructor(deviceList)
    {
        /** @private */
        this.onInputEvent = this.onInputEvent.bind(this);

        let deviceMap = {};
        let inputMap = {};
        for(let device of deviceList)
        {
            const deviceName = device.deviceName;
            deviceMap[deviceName] = device;
            inputMap[deviceName] = {};
            device.addInputListener(WILDCARD_KEY_MATCHER, this.onInputEvent);
        }
        this.devices = deviceMap;
        this.inputs = inputMap;

        /** @private */
        this.listeners = {
            poll: [],
            update: [],
        };

        /** @private */
        this._autopoll = false;
        /** @private */
        this._animationFrameHandle = null;

        /** @private */
        this.onAnimationFrame = this.onAnimationFrame.bind(this);
    }

    set autopoll(value)
    {
        this._autopoll = value;
        if (value)
        {
            // Start animation frame loop
            this._animationFrameHandle = requestAnimationFrame(this.onAnimationFrame);
        }
        else
        {
            // Stop animation frame loop
            cancelAnimationFrame(this._animationFrameHandle);
        }
    }

    get autopoll()
    {
        return this._autopoll;
    }

    destroy()
    {
        this.clear();
        
        for(let deviceName in this.devices)
        {
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
     * @param {String} event 
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
     * Dispatches an event to the listeners.
     * 
     * @param {String} eventName The name of the event.
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
     * @private
     * @param {InputSourceStage} stage 
     * @param {String} deviceName 
     * @param {String} keyCode 
     * @param {Axis|Button} input 
     */
    _dispatchInputEvent(stage, deviceName, keyCode, input)
    {
        this.dispatchEvent('input', { stage, deviceName, keyCode, input });
    }

    /** @private */
    _dispatchPollEvent(now)
    {
        this.dispatchEvent('poll', { now });
    }
    
    /**
     * Poll the devices and update the input state.
     */
    poll(now = performance.now())
    {
        for(const deviceName in this.inputs)
        {
            const inputMap = this.inputs[deviceName];
            for(const keyCode in inputMap)
            {
                let input = inputMap[keyCode];
                input.poll();
                this._dispatchInputEvent(InputSourceStage.POLL, deviceName, keyCode, input);
            }
        }
        this._dispatchPollEvent(now);
    }

    /** @private */
    onAnimationFrame(now)
    {
        if (!this._autopoll) return;
        this._animationFrameHandle = requestAnimationFrame(this.onAnimationFrame);
        this.poll(now);
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
                    let button = this.inputs[deviceName][keyCode];
                    if (button)
                    {
                        button.update(e.event === InputEventCode.DOWN);
                        this._dispatchInputEvent(InputSourceStage.UPDATE, deviceName, keyCode, button);
                    }
                }
                break;
            case InputType.POS:
                {
                    let inputs = this.inputs[deviceName];
                    let xAxis = inputs.PosX;
                    if (xAxis)
                    {
                        xAxis.update(e.x, e.dx);
                        this._dispatchInputEvent(InputSourceStage.UPDATE, deviceName, 'PosX', xAxis);
                    }
                    let yAxis = inputs.PosY;
                    if (yAxis)
                    {
                        yAxis.update(e.y, e.dy);
                        this._dispatchInputEvent(InputSourceStage.UPDATE, deviceName, 'PosY', yAxis);
                    }
                }
                break;
            case InputType.WHEEL:
                {
                    let inputs = this.inputs[deviceName];
                    let xAxis = inputs.WheelX;
                    if (xAxis)
                    {
                        xAxis.update(e.dx, e.dx);
                        this._dispatchInputEvent(InputSourceStage.UPDATE, deviceName, 'WheelX', xAxis);
                    }
                    let yAxis = inputs.WheelY;
                    if (yAxis)
                    {
                        yAxis.update(e.dy, e.dy);
                        this._dispatchInputEvent(InputSourceStage.UPDATE, deviceName, 'WheelY', yAxis);
                    }
                    let zAxis = inputs.WheelZ;
                    if (zAxis)
                    {
                        zAxis.update(e.dz, e.dz);
                        this._dispatchInputEvent(InputSourceStage.UPDATE, deviceName, 'WheelZ', zAxis);
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
    add(deviceName, keyCode)
    {
        if (!(deviceName in this.devices))
        {
            throw new Error('Invalid device name - missing device with name in source.');
        }

        let result = isInputAxis(deviceName, keyCode)
            ? new Axis()
            : new Button();
        this.inputs[deviceName][keyCode] = result;
        return this;
    }

    /**
     * Remove the input for the given device and key code.
     * 
     * @param {String} deviceName 
     * @param {String} keyCode 
     */
    delete(deviceName, keyCode)
    {
        delete this.inputs[deviceName][keyCode];
    }

    /** @returns {Button|Axis} */
    get(deviceName, keyCode)
    {
        return this.inputs[deviceName][keyCode];
    }
    
    /**
     * @param {String} deviceName 
     * @param {String} keyCode 
     * @returns {Boolean} Whether the device and key code has been added.
     */
    has(deviceName, keyCode)
    {
        return deviceName in this.inputs && keyCode in this.inputs[deviceName];
    }

    /**
     * Removes all registered inputs from all devices.
     */
    clear()
    {
        for(let deviceName in this.devices)
        {
            this.inputs[deviceName] = {};
        }
    }
}
