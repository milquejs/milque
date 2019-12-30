import { ActionInput } from './ActionInput.js';
import { RangeInput } from './RangeInput.js';
import { StateInput } from './StateInput.js';

export const MIN_CONTEXT_PRIORITY = -100;
export const MAX_CONTEXT_PRIORITY = 100;

export function createContext()
{
    return {
        _source: null,
        _priority: 0,
        _active: true,
        actions: new Map(),
        ranges: new Map(),
        states: new Map(),
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
        registerAction(name, ...eventKeyStrings)
        {
            let result = new ActionInput(eventKeyStrings);
            this.actions.set(name, result);
            return result;
        },
        registerRange(name, eventKeyString)
        {
            let result = new RangeInput(eventKeyString);
            this.ranges.set(name, result);
            return result;
        },
        registerState(name, eventKeyMap)
        {
            let result = new StateInput(eventKeyMap);
            this.states.set(name, result);
            return result;
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
            for(let action of this.actions.values())
            {
                action.poll();
            }

            for(let range of this.ranges.values())
            {
                range.poll();
            }

            for(let state of this.states.values())
            {
                state.poll();
            }
        },
        update(eventKey, value)
        {
            let result;
            for(let action of this.actions.values())
            {
                result |= action.update(eventKey, value);
            }

            for(let range of this.ranges.values())
            {
                result |= range.update(eventKey, value);
            }

            for(let state of this.states.values())
            {
                result |= state.update(eventKey, value);
            }
            return result;
        }
    };
}
