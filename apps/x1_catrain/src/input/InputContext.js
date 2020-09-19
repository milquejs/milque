import { AdapterManager } from './adapter/AdapterManager.js';
import { Synthetic } from './adapter/Synthetic.js';
import { InputSourceStage } from './source/InputSource.js';

export class InputContext
{
    /**
     * Constructs a disabled InputContext with the given adapters and inputs.
     * 
     * @param {import('./source/InputSource.js').InputSource} inputSource 
     * @param {Object} inputMap The input to adapter options object map.
     * @param {Object} [opts] Any additional options.
     * @param {Boolean} [opts.disabled=false] Whether the context should start disabled.
     */
    constructor(inputSource, inputMap, opts = {})
    {
        const { disabled = false } = opts;
        this.inputSource = inputSource;
        this.disabled = disabled;
        /** @private */
        this._ignoreInput = disabled;

        /** @private */
        this.adapters = new AdapterManager(inputSource);

        let inputs = {};
        for(let inputName in inputMap)
        {
            let adapterOptions = inputMap[inputName];
            let synthetic = new Synthetic(adapterOptions);
            let syntheticAdapters = synthetic.adapters;
            for(let adapter of syntheticAdapters)
            {
                const { deviceName, keyCode } = adapter;
                if (!inputSource.has(deviceName, keyCode))
                {
                    inputSource.add(deviceName, keyCode);
                }
            }
            this.adapters.add(syntheticAdapters);
            inputs[inputName] = synthetic;
        }
        /** @private */
        this.inputs = inputs;

        /** @private */
        this.onSourceInput = this.onSourceInput.bind(this);
        /** @private */
        this.onSourcePoll = this.onSourcePoll.bind(this);
        inputSource.addEventListener('input', this.onSourceInput);
        inputSource.addEventListener('poll', this.onSourcePoll);
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
     * @param {Boolean} [force] The value to set it to. If undefined,
     * it will toggle the value.
     * @returns {InputContext} Self for method chaining.
     */
    toggle(force = !this.disabled)
    {
        this.disabled = force;
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
        return this.inputs[inputName].value;
    }
}
