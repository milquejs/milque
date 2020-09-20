import { AdapterManager } from './adapter/AdapterManager.js';
import { Synthetic, stringifyDeviceKeyCodePair } from './adapter/Synthetic.js';
import { InputSourceStage } from './source/InputSource.js';

export class InputContext
{
    /**
     * Constructs a disabled InputContext with the given adapters and inputs.
     * 
     * @param {Object} [opts] Any additional options.
     * @param {Boolean} [opts.disabled=false] Whether the context should start disabled.
     */
    constructor(opts = {})
    {
        const { disabled = true } = opts;

        /** @type {import('./source/InputSource.js').InputSource} */
        this.inputSource = null;

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
    }

    get disabled() { return this._disabled; }
    set disabled(value) { this.toggle(!value); }

    /**
     * @param {Object} inputMap The input to adapter options object map.
     * @returns {InputContext} Self for method-chaining.
     */
    setInputMap(inputMap)
    {
        this._setupInputs(this.inputSource, inputMap);
        return this;
    }

    /**
     * @param {import('./source/InputSource.js').InputSource} inputSource The
     * source of all inputs listened to.
     * @returns {InputContext} Self for method-chaining.
     */
    attach(inputSource)
    {
        this._setupInputs(inputSource, null);
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

    /** @private */
    _setupInputs(inputSource, inputMap)
    {
        // Make sure this context is disabled before changing it...
        const prevDisabled = this.disabled;
        this.toggle(false);

        // Prepare previous state...
        const prevInputSource = this.inputSource;
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
                    let refCount = removeSourceRef(prevInputSource, deviceName, keyCode);
                    if (refCount === 0)
                    {
                        prevInputSource.delete(deviceName, keyCode);
                    }
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
                let synthetic = new Synthetic(adapterOptions);
                let syntheticAdapters = synthetic.adapters;
                this.adapters.add(syntheticAdapters);
                inputs[inputName] = synthetic;
            }
            this.inputs = inputs;
        }

        if (inputSource)
        {
            initSourceRefs(inputSource);

            const inputs = this.inputs;
            for(let inputName in inputs)
            {
                let { adapters } = inputs[inputName];
                for(let adapter of adapters)
                {
                    const { deviceName, keyCode } = adapter;
                    let refCount = addSourceRef(inputSource, deviceName, keyCode);
                    if (refCount === 1)
                    {
                        inputSource.add(deviceName, keyCode);
                    }
                }
            }

            if (this.inputSource !== inputSource)
            {
                inputSource.addEventListener('poll', this.onSourcePoll);
                inputSource.addEventListener('input', this.onSourceInput);
                this.inputSource = inputSource;
            }
        }

        // Make sure this context returns to its previous expected state...
        this.toggle(prevDisabled);
    }

    /**
     * @private
     * @param {import('./source/InputSource.js').SourceInputEvent} e
     */
    onSourceInput(e)
    {
        if (!e.consumed && !this._ignoreInput)
        {
            const { stage, deviceName, keyCode, input } = e;
            switch(stage)
            {
                case InputSourceStage.POLL:
                    this.adapters.poll(deviceName, keyCode, input);
                    break;
                case InputSourceStage.UPDATE:
                    this.adapters.update(deviceName, keyCode, input);
                    break;
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
     * @param {import('./source/InputSource.js').SourcePollEvent} e
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
    toggle(force = this.disabled)
    {
        if (force)
        {
            if (this.inputSource === null)
            {
                throw new Error('Input source must be set before enabling input context.');
            }
    
            if (Object.keys(this.inputs).length <= 0)
            {
                console.warn('No inputs found for enabled input context - did you forget to setInputMap()?');
            }
        }
        this.disabled = !force;
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
        return this.inputs[inputName];
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
}

const INPUT_SOURCE_INPUT_REF_COUNTS = Symbol('inputRefCounts');

function initSourceRefs(inputSource)
{
    if (!(INPUT_SOURCE_INPUT_REF_COUNTS in inputSource))
    {
        inputSource[INPUT_SOURCE_INPUT_REF_COUNTS] = {};
    }
}

function countSourceRef(inputSource, deviceName, keyCode)
{
    const keyString = stringifyDeviceKeyCodePair(deviceName, keyCode);
    let refCounts = inputSource[INPUT_SOURCE_INPUT_REF_COUNTS];
    return refCounts[keyString] || 0;
}

function addSourceRef(inputSource, deviceName, keyCode)
{
    const keyString = stringifyDeviceKeyCodePair(deviceName, keyCode);
    let refCounts = inputSource[INPUT_SOURCE_INPUT_REF_COUNTS];
    let value = (refCounts[keyString] + 1) || 1;
    refCounts[keyString] = value;
    return value;
}

function removeSourceRef(inputSource, deviceName, keyCode)
{
    const keyString = stringifyDeviceKeyCodePair(deviceName, keyCode);
    let refCounts = inputSource[INPUT_SOURCE_INPUT_REF_COUNTS];
    let value = (refCounts[keyString] - 1) || 0;
    refCounts[keyString] = Math.max(value, 0);
    return value;
}
