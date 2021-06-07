import { InputBase } from './InputBase.js';

/**
 * @typedef {import('./InputBase.js').BindingIndex} BindingIndex
 * @typedef {import('./InputBase.js').BindingOptions} BindingOptions
 * 
 * @typedef ButtonReadOnly
 * @property {number} value
 * @property {boolean} pressed
 * @property {boolean} repeated
 * @property {boolean} released
 * @property {boolean} down
 * @property {boolean} polling
 */

export const CLEAR_POLL_BITS = 0b1111_0001;
export const CLEAR_DOWN_STATE_BITS = 0b1111_1110;
export const CLEAR_INVERTED_MODIFIER_BITS = 0b1110_1111;

export const DOWN_STATE_BIT = 0b0000_0001;
export const PRESSED_STATE_BIT = 0b0000_0010;
export const REPEATED_STATE_BIT = 0b0000_0100;
export const RELEASED_STATE_BIT = 0b0000_1000;
export const INVERTED_MODIFIER_BIT = 0b0001_0000;

export class Button extends InputBase
{
    /** @returns {boolean} */
    get pressed()
    {
        return this._pressed;
    }

    /** @returns {boolean} */
    get repeated()
    {
        return this._repeated;
    }

    /** @returns {boolean} */
    get released()
    {
        return this._released;
    }

    /** @returns {boolean} */
    get down()
    {
        return this._down;
    }

    /**
     * @override
     * @returns {number}
     */
    get value()
    {
        return this._value;
    }
    
    /**
     * @param {number} [size] 
     */
    constructor(size = 0)
    {
        super(size);
        /** @private */
        this._state = new Uint8Array(size);
        /** @private */
        this._value = 0;
        /** @private */
        this._down = false;
        /** @private */
        this._pressed = false;
        /** @private */
        this._repeated = false;
        /** @private */
        this._released = false;
    }

    /**
     * @override
     * @protected
     */
    resize(newSize)
    {
        let oldState = this._state;
        let oldSize = oldState.length;
        let newState;
        if (newSize <= oldSize)
        {
            newState = oldState.slice(0, newSize);
        }
        else
        {
            newState = new Uint8Array(newSize);
            newState.set(oldState);
        }
        this._state = newState;
        super.resize(newSize);
    }

    /**
     * @override
     * @param {BindingIndex} code
     * @returns {number}
     */
    getState(code)
    {
        let state = this._state[code];
        let modifier = state & INVERTED_MODIFIER_BIT ? -1 : 1;
        let value = state & DOWN_STATE_BIT ? 1 : 0;
        return value * modifier;
    }

    /**
     * @override
     * @param {number} now
     */
    onPoll(now)
    {
        let state = this._state;
        let result = 0;
        let down = 0;
        let pressed = 0;
        let repeated = 0;
        let released = 0;
        const len = state.length;
        for(let i = 0; i < len; ++i)
        {
            let value = state[i];
            let v = value & DOWN_STATE_BIT;
            let m = value & INVERTED_MODIFIER_BIT;
            down |= v;
            pressed |= value & PRESSED_STATE_BIT;
            repeated |= value & REPEATED_STATE_BIT;
            released |= value & RELEASED_STATE_BIT;
            result += (v ? 1 : 0) * (m ? -1 : 1);
            state[i] &= CLEAR_POLL_BITS;
        }
        this._value = result;
        this._down = down !== 0;
        this._pressed = pressed !== 0;
        this._repeated = repeated !== 0;
        this._released = released !== 0;
        super.onPoll(now);
    }

    /**
     * @override
     * @param {BindingIndex} code 
     * @param {number} value 
     * @param {number} delta 
     */
    onUpdate(code, value, delta)
    {
        if (delta > 0)
        {
            this.onButtonPressed(code);
        }
        else
        {
            this.onButtonReleased(code);
        }
    }

    /**
     * @override
     * @param {BindingIndex} code 
     * @param {number} value 
     */
    onStatus(code, value)
    {
        this.onButtonStatus(code, value !== 0);
    }

    /**
     * @override
     * @param {BindingIndex} code
     * @param {BindingOptions} [opts]
     */
    onBind(code, opts = {})
    {
        super.onBind(code, opts);
        const { inverted = false } = opts;
        let state = this._state;
        if (inverted)
        {
            state[code] |= INVERTED_MODIFIER_BIT;
        }
        else
        {
            state[code] &= CLEAR_INVERTED_MODIFIER_BITS;
        }
    }

    /**
     * @protected
     * @param {BindingIndex} code 
     */
    onButtonPressed(code)
    {
        let state = this._state;
        let bits = state[code];
        if (!(bits & DOWN_STATE_BIT))
        {
            bits |= PRESSED_STATE_BIT;
            bits |= DOWN_STATE_BIT;
        }
        bits |= REPEATED_STATE_BIT;
        state[code] = bits;
    }

    /**
     * @protected
     * @param {BindingIndex} code 
     */
    onButtonReleased(code)
    {
        let state = this._state;
        let bits = state[code];
        if (bits & DOWN_STATE_BIT)
        {
            bits |= RELEASED_STATE_BIT;
            bits &= CLEAR_DOWN_STATE_BITS;
        }
        state[code] = bits;
    }

    /**
     * @protected
     * @param {BindingIndex} code 
     * @param {boolean} isDown
     */
    onButtonStatus(code, isDown)
    {
        let state = this._state;
        let bits = state[code];
        let wasDown = Boolean(bits & DOWN_STATE_BIT);
        if (isDown)
        {
            bits |= DOWN_STATE_BIT;
        }
        else
        {
            bits &= CLEAR_DOWN_STATE_BITS;
        }
        if (wasDown && !isDown)
        {
            bits |= RELEASED_STATE_BIT;
        }
        if (!wasDown && isDown)
        {
            bits |= PRESSED_STATE_BIT;
            bits |= REPEATED_STATE_BIT;
        }
        state[code] = bits;
    }
}
