import { AdapterManager } from './adapter/AdapterManager.js';
import { Synthetic } from './input/Synthetic.js';
import { InputSourceEventStage } from './source/InputSourceImpl.js';
import { InputSource } from './source/InputSource.js';

export class InputContext
{
    /**
     * Constructs a disabled InputContext with the given adapters and inputs.
     * 
     * @param {EventTarget|InputSource} [inputSource=null] The source of all inputs listened to.
     * @param {Object} [inputMap=null] The input to adapter options object map.
     * @param {Boolean} [disabled=true] Whether the context should start disabled.
     */
    constructor(inputSource = null, inputMap = null, disabled = true)
    {
        /** @type {InputSource} */
        this.source = null;

        /** @private */
        this._disabled = disabled;
        /** @private */
        this._ignoreInput = disabled;

        /** @private */
        this.adapters = new AdapterManager();
        /** @private */
        this.inputs = {};

        /** @private */
        this.onSourceInput = this.onSourceInput.bind(this);
        /** @private */
        this.onSourcePoll = this.onSourcePoll.bind(this);

        if (inputSource || inputMap)
        {
            this._setupInputs(resolveInputSource(inputSource), inputMap);
        }

        if (!disabled)
        {
            this.attach();
        }
    }

    get disabled() { return this._disabled; }
    set disabled(value) { this.toggle(!value); }

    /**
     * @param {Object} inputMap The input to adapter options object map.
     * @returns {InputContext} Self for method-chaining.
     */
    setInputMap(inputMap)
    {
        this._setupInputs(this.source, inputMap);
        return this;
    }

    /**
     * @param {EventTarget|InputSource} inputSource The source of all inputs listened to.
     * @returns {InputContext} Self for method-chaining.
     */
    setInputSource(inputSource)
    {
        this._setupInputs(resolveInputSource(inputSource), null);
        return this;
    }

    /**
     * @returns {InputContext} Self for method-chaining.
     */
    attach()
    {
        if (!this.source)
        {
            throw new Error('Missing input source to attach context.');
        }
        this.toggle(true);
        return this;
    }

    /**
     * @returns {InputContext} Self for method-chaining.
     */
    detach()
    {
        this.toggle(false);
        this._setupInputs(null, null);
        return this;
    }

    /**
     * @private
     * @param {InputSource} inputSource
     * @param {object} inputMap
     */
    _setupInputs(inputSource, inputMap)
    {
        // Make sure this context is disabled before changing it...
        const prevDisabled = this.disabled;
        this.disabled = true;

        // Prepare previous state...
        /** @type {InputSource} */
        const prevInputSource = this.source;
        const prevInputs = this.inputs;
        const isPrevSourceReplaced = (prevInputSource !== inputSource) && prevInputSource;
        const isPrevInputsReplaced = this.inputs && inputMap;
        
        // Tear down
        if (isPrevSourceReplaced || isPrevInputsReplaced)
        {
            if (isPrevSourceReplaced)
            {
                prevInputSource.removeEventListener('poll', this.onSourcePoll);
                prevInputSource.removeEventListener('input', this.onSourceInput);
            }
            
            for(let inputName in prevInputs)
            {
                let { adapters } = prevInputs[inputName];
                for(let adapter of adapters)
                {
                    const { deviceName, keyCode } = adapter;
                    prevInputSource.unregisterKey(deviceName, keyCode);
                }
            }

            if (isPrevInputsReplaced)
            {
                this.adapters.clear();
                this.inputs = {};
            }
        }

        // Set up
        if (inputMap)
        {
            let inputs = {};
            for(let inputName in inputMap)
            {
                let adapterOptions = inputMap[inputName];
                let synthetic = prevInputs[inputName] || new Synthetic();
                synthetic.hydrate(adapterOptions);
                let syntheticAdapters = synthetic.adapters;
                this.adapters.add(syntheticAdapters);
                inputs[inputName] = synthetic;
            }
            this.inputs = inputs;
        }

        if (inputSource)
        {
            const inputs = this.inputs;
            for(let inputName in inputs)
            {
                let { adapters } = inputs[inputName];
                for(let adapter of adapters)
                {
                    const { deviceName, keyCode } = adapter;
                    inputSource.registerKey(deviceName, keyCode);
                }
            }

            if (this.source !== inputSource)
            {
                inputSource.addEventListener('poll', this.onSourcePoll);
                inputSource.addEventListener('input', this.onSourceInput);
                this.source = inputSource;
            }
        }

        // Make sure this context returns to its previous expected state...
        this.disabled = prevDisabled;
    }

    /**
     * @private
     * @param {import('./source/InputEventSource.js').SourceInputEvent} e
     */
    onSourceInput(e)
    {
        if (!e.detail.consumed && !this._ignoreInput)
        {
            const { stage, deviceName, keyCode, input } = e.detail;
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
     * @param {import('./source/InputEventSource.js').SourcePollEvent} e
     */
    onSourcePoll(e)
    {
        if (this._ignoreInput !== this.disabled)
        {
            this._ignoreInput = this.disabled;
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
        if (force)
        {
            if (!this.source)
            {
                throw new Error('Input source must be set before enabling input context.');
            }
    
            if (Object.keys(this.inputs).length <= 0)
            {
                console.warn('No inputs found for enabled input context - did you forget to setInputMap()?');
            }
        }
        this._disabled = !force;
        return this;
    }

    /**
     * Get the synthetic input object by name.
     * 
     * @param {String} inputName 
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
            return synthetic;
        }
    }

    hasInput(inputName)
    {
        return inputName in this.inputs && this.inputs[inputName].adapters.length > 0;
    }

    /**
     * Get the current value of the input by name.
     * 
     * @param {String} inputName
     * @returns {Number} The input value.
     */
    getInputValue(inputName)
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

    getInputState(inputName)
    {
        return this.getInputValue(inputName);
    }

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

function resolveInputSource(inputSourceOrEventTarget)
{
    if (!(inputSourceOrEventTarget instanceof InputSource))
    {
        return new InputSource(inputSourceOrEventTarget);
    }
    else
    {
        return inputSourceOrEventTarget;
    }
}
