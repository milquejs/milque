import { InputEventCode, InputType, WILDCARD_KEY_MATCHER } from '../device/InputDevice.js';
import { Axis } from '../input/Axis.js';
import { Button } from '../input/Button.js';

/**
 * @typedef {import('../device/InputDevice.js').InputDevice} InputDevice
 */

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
 * 
 * @typedef {'update'|'poll'} InputSourceEventTypes
 * 
 * @typedef KeyMapEntry
 * @property {number} refs The number of active references to this key.
 * @property {Input} input The input object.
 */

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
 * A class to model the current input state with buttons and axes for devices.
 */
export class InputSourceImpl
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
            update: [],
        };

        /** @private */
        this._autopoll = false;
        /** @private */
        this._animationFrameHandle = null;
    }

    destroy()
    {
        this.clearKeys();
        
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
        for(const deviceName in this.keyMap)
        {
            let deviceKeyMap = this.keyMap[deviceName];
            for(const keyCode in deviceKeyMap)
            {
                let input = getKeyMapEntryInput(deviceKeyMap[keyCode]);
                input.poll();
                this.dispatchInputEvent(InputSourceEventStage.POLL, deviceName, keyCode, input);
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
     * @param {InputSourceEventTypes} event The name of the event.
     * @param {InputSourceEventListener} listener The listener callback.
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
     * @param {InputSourceEventTypes} event The name of the event.
     * @param {InputSourceEventListener} listener The listener callback.
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
     * @param {InputSourceEventTypes} event The name of the event.
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
     * @param {InputSourceEventTypes} event The name of the event.
     * @param {InputSourceInputEvent|InputSourcePollEvent} eventOpts The event object to pass to listeners.
     */
    dispatchEvent(event, eventOpts)
    {
        for(let listener of this.listeners[event])
        {
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
        const deviceKeyMap = this.keyMap[deviceName];
        switch(e.type)
        {
            case InputType.KEY:
                {
                    const keyCode = e.keyCode;
                    let button = getKeyMapEntryInput(deviceKeyMap[keyCode]);
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
                    let xAxis = getKeyMapEntryInput(deviceKeyMap.PosX);
                    if (xAxis)
                    {
                        xAxis.update(e.x, e.dx);
                        this.dispatchInputEvent(InputSourceEventStage.UPDATE, deviceName, 'PosX', xAxis);
                    }
                    let yAxis = getKeyMapEntryInput(deviceKeyMap.PosY);
                    if (yAxis)
                    {
                        yAxis.update(e.y, e.dy);
                        this.dispatchInputEvent(InputSourceEventStage.UPDATE, deviceName, 'PosY', yAxis);
                    }
                }
                break;
            case InputType.WHEEL:
                {
                    let xAxis = getKeyMapEntryInput(deviceKeyMap.WheelX);
                    if (xAxis)
                    {
                        xAxis.update(e.dx, e.dx);
                        this.dispatchInputEvent(InputSourceEventStage.UPDATE, deviceName, 'WheelX', xAxis);
                    }
                    let yAxis = getKeyMapEntryInput(deviceKeyMap.WheelY);
                    if (yAxis)
                    {
                        yAxis.update(e.dy, e.dy);
                        this.dispatchInputEvent(InputSourceEventStage.UPDATE, deviceName, 'WheelY', yAxis);
                    }
                    let zAxis = getKeyMapEntryInput(deviceKeyMap.WheelZ);
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
     * Register and enable the source input to listen to for the given device
     * and key code. Can be registered more than once to obtain active lease
     * on the input, which guarantees it will be unregistered the same number
     * of times before removal.
     * 
     * @param {string} deviceName The name of the device (case-sensitive).
     * @param {string} keyCode The key code for the given key in the device.
     */
    registerKey(deviceName, keyCode)
    {
        if (!(deviceName in this.devices))
        {
            throw new Error(`Invalid device name - missing device with name '${deviceName}' in source.`);
        }

        let deviceKeyMap = this.keyMap[deviceName];
        if (keyCode in deviceKeyMap)
        {
            incrementKeyMapEntryRef(deviceKeyMap[keyCode]);
        }
        else
        {
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
    unregisterKey(deviceName, keyCode)
    {
        let deviceKeyMap = this.keyMap[deviceName];
        if (deviceKeyMap)
        {
            let keyMapEntry = deviceKeyMap[keyCode];
            if (keyMapEntry)
            {
                decrementKeyMapEntryRef(keyMapEntry);
                if (keyMapEntry.refs <= 0)
                {
                    delete deviceKeyMap[keyCode];
                }
            }
        }
    }

    /**
     * Removes all registered inputs from all devices.
     */
    clearKeys()
    {
        for(let deviceName in this.devices)
        {
            let deviceKeyMap = this.keyMap[deviceName];
            // Clean-up device key map.
            for(let keyCode in deviceKeyMap)
            {
                clearKeyMapEntryRef(deviceKeyMap[keyCode]);
            }
            // Actually clear it from future references.
            this.keyMap[deviceName] = {};
        }
    }

    /**
     * @returns {Button|Axis}
     */
    getInputByKey(deviceName, keyCode)
    {
        return this.keyMap[deviceName][keyCode];
    }
    
    /**
     * @param {string} deviceName The name of the device.
     * @param {string} keyCode The key code in the device.
     * @returns {boolean} Whether the device and key code has been registered.
     */
    hasInputByKey(deviceName, keyCode)
    {
        return deviceName in this.keyMap && keyCode in this.keyMap[deviceName];
    }
}

/**
 * @param {Input} [input]
 * @returns {KeyMapEntry}
 */
function createKeyMapEntry(input = null)
{
    return {
        refs: 1,
        input: input,
    };
}

/**
 * @param {KeyMapEntry} keyMapEntry 
 */
function getKeyMapEntryInput(keyMapEntry)
{
    return keyMapEntry ? keyMapEntry.input : null;
}

/**
 * @param {KeyMapEntry} keyMapEntry 
 */
function incrementKeyMapEntryRef(keyMapEntry)
{
    keyMapEntry.refs += 1;
}

/**
 * @param {KeyMapEntry} keyMapEntry
 */
function decrementKeyMapEntryRef(keyMapEntry)
{
    keyMapEntry.refs -= 1;
}

/**
 * @param {KeyMapEntry} keyMapEntry 
 */
function clearKeyMapEntryRef(keyMapEntry)
{
    keyMapEntry.refs = 0;
}
