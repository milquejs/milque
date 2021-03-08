import { AdapterManager } from '../adapter/AdapterManager.js';
import { InputSourceEventStage } from '../source/InputSourceState.js';
import { Synthetic } from '../input/Synthetic.js';

/**
 * @typedef {import('./source/InputSourceState.js').InputSourceInputEvent} InputSourceInputEvent
 * @typedef {import('./source/InputSourceState.js').InputSourcePollEvent} InputSourcePollEvent
 */

/**
 * @typedef {string} InputEvent
 * @typedef {string} InputKeyString
 * 
 * @typedef InputKeyOption
 * @property {InputKeyString} key
 * @property {InputEvent} [event]
 * @property {number} [scale]
 * 
 * @typedef {InputKeyString|InputKeyOption} InputMappingEntryValue
 * @typedef {InputMappingEntryValue|Array<InputMappingEntryValue>} InputMappingEntry
 * @typedef {Record<string, InputMappingEntry>} InputMapping
 * 
 * @typedef {Record<string, Synthetic>} SyntheticMap 
 */

/**
 * @typedef {'change'|'attach'|'detach'} InputContextEventTypes
 * 
 * @typedef InputContextChangeEvent
 * @typedef InputContextAttachEvent
 * @typedef InputContextDetachEvent
 * 
 * @callback InputContextEventListener
 * @param {InputContextChangeEvent|InputContextAttachEvent|InputContextDetachEvent} e
 */

export class InputContext
{
    /**
     * Constructs a disabled InputContext.
     */
    constructor()
    {
        /** @private */
        this._source = null;
        /** @private */
        this._mapping = null;

        /** @private */
        this._disabled = true;
        /** @private */
        this._ignoreInputs = this._disabled;

        /** @private */
        this.adapters = new AdapterManager();
        /**
         * @private
         * @type {SyntheticMap}
         */
        this.inputs = {};

        /** @private */
        this.listeners = {
            change: [],
            attach: [],
            detach: [],
        };

        /** @private */
        this.onSourceInput = this.onSourceInput.bind(this);
        /** @private */
        this.onSourcePoll = this.onSourcePoll.bind(this);
    }

    get source() { return this._source; }
    get mapping() { return this._mapping; }

    get disabled() { return this._disabled; }
    set disabled(value) { this.toggle(!value); }

    /**
     * @param {InputMapping} inputMapping
     * @returns {InputContext}
     */
    setInputMapping(inputMapping)
    {
        const prevDisabled = this.disabled;
        this.disabled = true;

        let prevSource = this.source;
        let prevInputs = this.inputs;

        // Clean up previous state.
        if (prevSource)
        {
            unregisterInputKeys(prevSource, prevInputs);
        }
        this.adapters.clear();

        // Set up next state.
        let nextSource = this.source;
        let nextInputs = {};
        if (inputMapping)
        {
            for(let inputName in inputMapping)
            {
                let adapterOptions = inputMapping[inputName];
                // NOTE: Preserve synthetics across restarts.
                let synthetic = prevInputs[inputName] || new Synthetic();
                synthetic.hydrate(adapterOptions);
                let syntheticAdapters = synthetic.adapters;
                this.adapters.add(syntheticAdapters);
                nextInputs[inputName] = synthetic;
            }
            if (nextSource)
            {
                registerInputKeys(nextSource, nextInputs);
            }
        }
        this.inputs = nextInputs;
        this._mapping = inputMapping;
        this.dispatchChangeEvent();

        // Force disable if missing required components, otherwise return to previous operating state.
        this.disabled = this.source && this.inputs ? prevDisabled : true;
        return this;
    }

    attach(inputSource)
    {
        if (this.source)
        {
            this.detach();
        }
        
        if (!inputSource)
        {
            throw new Error('Missing input source to attach context.');
        }
        
        registerInputKeys(inputSource, this.inputs);

        inputSource.addEventListener('poll', this.onSourcePoll);
        inputSource.addEventListener('input', this.onSourceInput);
        this._source = inputSource;

        this.toggle(true);
        this.dispatchAttachEvent();
        return this;
    }

    detach()
    {
        let prevSource = this.source;
        let prevInputs = this.inputs;

        if (prevSource)
        {
            this.toggle(false);

            prevSource.removeEventListener('poll', this.onSourcePoll);
            prevSource.removeEventListener('input', this.onSourceInput);

            if (prevInputs)
            {
                unregisterInputKeys(prevSource, prevInputs);
            }
            
            this._source = null;
            this.dispatchDetachEvent();
        }

        return this;
    }

    /**
     * Add listener to listen for event, in order by most
     * recently added. In other words, this listener will
     * be called BEFORE the previously added listener (if
     * there exists one) and so on.
     * 
     * @param {InputContextEventTypes} event The name of the event.
     * @param {InputContextEventListener} listener The listener callback.
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
     * @param {InputContextEventTypes} event The name of the event.
     * @param {InputContextEventListener} listener The listener callback.
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
     * @param {InputContextEventTypes} event The name of the event.
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

    /** @private */
    dispatchChangeEvent()
    {
        this.dispatchEvent('change', {});
    }

    /** @private */
    dispatchAttachEvent()
    {
        this.dispatchEvent('attach', {});
    }

    /** @private */
    dispatchDetachEvent()
    {
        this.dispatchEvent('detach', {});
    }

    /**
     * @private
     * @param {InputSourceInputEvent} e
     */
    onSourceInput(e)
    {
        if (!e.consumed && !this._ignoreInputs)
        {
            const { stage, deviceName, keyCode, input } = e;
            switch(stage)
            {
                case InputSourceEventStage.POLL:
                    this.adapters.poll(deviceName, keyCode, input);
                    break;
                case InputSourceEventStage.UPDATE:
                    this.adapters.update(deviceName, keyCode, input);
                    break;
                default:
                    throw new Error('Unknown input source stage.');
            }
            e.consumed = true;
        }
        else
        {
            const { deviceName, keyCode, input } = e;
            this.adapters.reset(deviceName, keyCode, input);
        }
    }

    /**
     * @private
     * @param {InputSourcePollEvent} e
     */
    onSourcePoll(e)
    {
        if (this._ignoreInputs !== this.disabled)
        {
            this._ignoreInputs = this.disabled;
        }
    }

    /**
     * Set the context to enabled/disabled.
     * 
     * @param {Boolean} [force] If defined, the context is enabled if true,
     * disabled if false. If undefined, it will toggle the current value.
     * @returns {InputContext} Self for method chaining.
     */
    toggle(force = this._disabled)
    {
        let result = !force;
        if (!result)
        {
            if (!this.source)
            {
                throw new Error('Input source must be set before enabling input context.');
            }
        }
        this._disabled = result;
        return this;
    }

    /**
     * @param {string} inputName The name of the input.
     * @returns {boolean} Whether the input exists for the given name.
     */
    hasInput(inputName)
    {
        return inputName in this.inputs && this.inputs[inputName].adapters.length > 0;
    }

    /**
     * Get the synthetic input object by name.
     * 
     * @param {string} inputName The name of the input.
     * @returns {Synthetic} The synthetic input for the given input name.
     */
    getInput(inputName)
    {
        if (inputName in this.inputs)
        {
            return this.inputs[inputName];
        }
        else
        {
            let synthetic = new Synthetic();
            this.inputs[inputName] = synthetic;
            this._mapping[inputName] = '';
            this.dispatchChangeEvent();
            return synthetic;
        }
    }

    /**
     * Get the current value of the input by name.
     * 
     * @param {String} inputName The name of the input.
     * @returns {number} The input value.
     */
    getInputState(inputName)
    {
        if (inputName in this.inputs)
        {
            return this.inputs[inputName].value;
        }
        else
        {
            return 0;
        }
    }

    /**
     * Get the change in value of the input by name since last poll.
     * 
     * @param {String} inputName The name of the input.
     * @returns {number} The input value.
     */
    getInputChanged(inputName)
    {
        if (inputName in this.inputs)
        {
            let input = this.inputs[inputName];
            return input.value - input.prev;
        }
        else
        {
            return 0;
        }
    }
}

function registerInputKeys(inputSource, inputs)
{
    for(let inputName in inputs)
    {
        let { adapters } = inputs[inputName];
        for(let adapter of adapters)
        {
            const { deviceName, keyCode } = adapter;
            inputSource.registerKey(deviceName, keyCode);
        }
    }
}

function unregisterInputKeys(inputSource, inputs)
{
    for(let inputName in inputs)
    {
        let { adapters } = inputs[inputName];
        for(let adapter of adapters)
        {
            const { deviceName, keyCode } = adapter;
            inputSource.unregisterKey(deviceName, keyCode);
        }
    }
}
