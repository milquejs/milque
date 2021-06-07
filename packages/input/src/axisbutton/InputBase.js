/**
 * @typedef {number} BindingIndex
 * 
 * @typedef BindingOptions
 * @property {boolean} inverted
 * 
 * @typedef InputReadOnly
 * @property {number} value
 * @property {boolean} polling
 */

export class InputBase
{
    get polling()
    {
        let dt = performance.now() - this._lastPollingTime;
        return dt < 1_000;
    }

    /** @abstract */
    get value()
    {
        return 0;
    }

    /** @protected */
    get size()
    {
        return this._size;
    }

    /**
     * @abstract
     * @param {number} size The initial binding state size.
     */
    constructor(size)
    {
        /** @private */
        this._size = size;
        /** @private */
        this._lastPollingTime = Number.MIN_SAFE_INTEGER;
    }

    /**
     * Called to internally resize to accomodate more/less
     * binding states.
     * 
     * @protected
     * @param {number} newSize 
     */
    resize(newSize)
    {
        this._size = newSize;
    }

    /**
     * @abstract
     * @param {BindingIndex} code 
     * @returns {number}
     */
    // eslint-disable-next-line no-unused-vars
    getState(code)
    {
        throw new Error('Missing implementation.');
    }

    /**
     * @abstract
     * @param {BindingIndex} code 
     * @param {number} value 
     * @param {number} delta 
     */
    // eslint-disable-next-line no-unused-vars
    onUpdate(code, value, delta)
    {
        throw new Error('Missing implementation.');
    }

    /**
     * @abstract
     * @param {BindingIndex} code 
     * @param {number} value 
     */
    // eslint-disable-next-line no-unused-vars
    onStatus(code, value)
    {
        throw new Error('Missing implementation.');
    }

    /**
     * Called to poll all bound states.
     * 
     * @param {number} now 
     */
    onPoll(now)
    {
        this._lastPollingTime = now;
    }

    /**
     * Called to bind a state to the given binding code.
     * 
     * @param {BindingIndex} code
     * @param {BindingOptions} [opts]
     */
    // eslint-disable-next-line no-unused-vars
    onBind(code, opts = {})
    {
        if (code >= this._size)
        {
            this.resize(code + 1);
        }
    }

    /**
     * Called to unbind all states.
     */
    onUnbind()
    {
        this.resize(0);
    }
}
