import { ActionInputAdapter } from './adapters/ActionInputAdapter.js';
import { RangeInputAdapter } from './adapters/RangeInputAdapter.js';
import { StateInputAdapter } from './adapters/StateInputAdapter.js';

export const MIN_CONTEXT_PRIORITY = -100;
export const MAX_CONTEXT_PRIORITY = 100;

export function createContext()
{
    return {
        _source: null,
        _priority: 0,
        _active: true,
        inputs: new Map(),
        get active() { return this._active; },
        get source() { return this._source; },
        get priority() { return this._priority; },
        attach(inputSource)
        {
            this._source = inputSource;
            this._source.addContext(this);
            return this;
        },
        detach()
        {
            this._source.removeContext(this);
            this._source = null;
            return this;
        },
        setPriority(priority)
        {
            if (priority > MAX_CONTEXT_PRIORITY || priority < MIN_CONTEXT_PRIORITY)
            {
                throw new Error(`Context priority must be between [${MIN_CONTEXT_PRIORITY}, ${MAX_CONTEXT_PRIORITY}].`);
            }
            
            if (this._priority !== priority)
            {
                if (this._source)
                {
                    this._source.removeContext(this);
                    this._priority = priority;
                    this._source.addContext(this);
                }
                else
                {
                    this._priority = priority;
                }
            }
            return this;
        },
        registerInput(name, adapter)
        {
            this.inputs.set(name, adapter);
            return adapter;
        },
        registerAction(name, ...eventKeyStrings)
        {
            return this.registerInput(name, new ActionInputAdapter(eventKeyStrings));
        },
        registerRange(name, eventKeyString)
        {
            return this.registerInput(name, new RangeInputAdapter(eventKeyString));
        },
        registerState(name, eventKeyMap)
        {
            return this.registerInput(name, new StateInputAdapter(eventKeyMap));
        },
        toggle(force = undefined)
        {
            if (typeof force === 'undefined') force = !this._active;
            this._active = force;
            return this;
        },
        enable() { return this.toggle(true); },
        disable() { return this.toggle(false); },
        poll()
        {
            for(let adapter of this.inputs.values())
            {
                adapter.poll();
            }
        },
        update(eventKey, value)
        {
            let result;
            for(let adapter of this.inputs.values())
            {
                result |= adapter.update(eventKey, value);
            }
            return result;
        }
    };
}
