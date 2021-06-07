/**
 * An enum for input types.
 * 
 * @readonly
 * @enum {number}
 */
export const InputType = {
    NULL: 0,
    KEY: 1,
    POS: 2,
    WHEEL: 3,
};

/**
 * An enum for input events.
 * 
 * @readonly
 * @enum {number}
 */
export const InputEventCode = {
    NULL: 0,
    DOWN: 1,
    UP: 2,
    MOVE: 3,
    parse(string)
    {
        if (typeof string === 'string')
        {
            switch(string.toLowerCase())
            {
                case 'down': return InputEventCode.DOWN;
                case 'up': return InputEventCode.UP;
                case 'move': return InputEventCode.MOVE;
                default: return InputEventCode.NULL;
            }
        }
        else
        {
            return InputEventCode.NULL;
        }
    }
};

export const WILDCARD_KEY_MATCHER = '*';

/**
 * @typedef InputEvent
 * @property {EventTarget} target
 * @property {string} deviceName
 * @property {string} keyCode
 * @property {InputEventCode} event
 * @property {InputType} type
 * @property {number} [value] If type is `key`, it is defined to be the input
 * value of the triggered event (usually this is 1). Otherwise, it is undefined.
 * @property {boolean} [control] If type is `key`, it is defined to be true if
 * any control key is down (false if up). Otherwise, it is undefined.
 * @property {boolean} [shift] If type is `key`, it is defined to be true if
 * any shift key is down (false if up). Otherwise, it is undefined.
 * @property {boolean} [alt] If type is `key`, it is defined to be true if any
 * alt key is down (false if up). Otherwise, it is undefined.
 * @property {number} [x] If type is `pos`, it is defined to be the x value
 * of the position event. Otherwise, it is undefined.
 * @property {number} [y] If type is `pos`, it is defined to be the y value
 * of the position event. Otherwise, it is undefined.
 * @property {number} [dx] If type is `pos` or `wheel`, it is defined to be
 * the change in the x value from the previous to the current position.
 * Otherwise, it is undefined.
 * @property {number} [dy] If type is `pos` or `wheel`, it is defined to be
 * the change in the y value from the previous to the current position.
 * Otherwise, it is undefined.
 * @property {number} [dz] If type is `wheel`, it is defined to be the change
 * in the z value from the previous to the current position. Otherwise, it
 * is undefined.
 * 
 * @callback InputDeviceListener
 * @param {InputEvent} e
 * @returns {boolean} Whether to consume the input after all other
 * listeners had a chance to handle the event.
 */

/** Represents an input device. */
export class InputDevice
{
    /** @abstract */
    static isAxis(keyCode)
    {
        return false;
    }

    /** @abstract */
    static isButton(keyCode)
    {
        return false;
    }

    constructor(deviceName, eventTarget)
    {
        this.deviceName = deviceName;
        this.eventTarget = eventTarget;

        /** @private */
        this.listeners = {};
    }

    destroy()
    {
        /** @private */
        this.listeners = {};
    }

    /**
     * @param {string} keyMatcher
     * @param {InputDeviceListener} listener
     */
    addInputListener(keyMatcher, listener)
    {
        let inputListeners = this.listeners[keyMatcher];
        if (!inputListeners)
        {
            inputListeners = [listener];
            this.listeners[keyMatcher] = inputListeners;
        }
        else
        {
            inputListeners.push(listener);
        }
    }

    /**
     * @param {string} keyMatcher
     * @param {InputDeviceListener} listener
     */
    removeInputListener(keyMatcher, listener)
    {
        let inputListeners = this.listeners[keyMatcher];
        if (inputListeners)
        {
            inputListeners.indexOf(listener);
            inputListeners.splice(listener, 1);
        }
    }

    /**
     * @param {InputEvent} e
     * @returns {boolean} Whether the input event should be consumed.
     */
    dispatchInput(e)
    {
        const { keyCode } = e;
        const listeners = this.listeners[keyCode];
        let flag = 0;
        if (listeners)
        {
            // KeyCode listeners
            for(let listener of listeners)
            {
                flag |= listener(e);
            }
            return Boolean(flag);
        }
        // Wildcard listeners
        for(let listener of this.listeners[WILDCARD_KEY_MATCHER])
        {
            flag |= listener(e);
        }
        return Boolean(flag);
    }
}
