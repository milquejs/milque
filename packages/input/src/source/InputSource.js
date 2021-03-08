import { InputSourceState } from './InputSourceState.js';

import { Keyboard } from '../device/Keyboard.js';
import { Mouse } from '../device/Mouse.js';

/** This determines whether an element has an associated input event source. */
const INPUT_SOURCE_STATE_KEY = Symbol('inputSourceState');

/**
 * This serves as a layer of abstraction to get unique sources of input events by target elements. Getting
 * the input source for the same event target will return the same input source instance. This allows
 * easier management of input source references without worrying about duplicates.
 * 
 * If you do not want this feature but still want the events managed, use `InputSourceState` directly instead.
 */
export class InputSource extends InputSourceState
{
    /**
     * Get the associated input source for the given event target.
     * 
     * @param {EventTarget} eventTarget The target element to listen
     * for all input events.
     * @returns {InputSourceState} The input source for the given event target.
     */
    static for(eventTarget)
    {
        if (eventTarget)
        {
            return obtainInputSourceState(eventTarget);
        }
        else
        {
            throw new Error('Cannot get input source for null event target.');
        }
    }

    /**
     * Delete the associated input source for the given event target.
     * 
     * @param {EventTarget} eventTarget The target element being listened to.
     */
    static delete(eventTarget)
    {
        if (eventTarget)
        {
            releaseInputSourceState(eventTarget);
        }
    }

    /** @private */
    constructor()
    {
        super();

        // NOTE: This is to enforce the for() and delete() structure.
        throw new Error('Cannot construct InputSource with new - use InputSourceState() instead.');
    }
}

/**
 * @param {EventTarget} eventTarget The target element to listen to.
 * @returns {boolean} Whether the event target has an associated input source.
 */
function hasAttachedInputSourceState(eventTarget)
{
    return Object.prototype.hasOwnProperty.call(eventTarget, INPUT_SOURCE_STATE_KEY)
        && Object.getOwnPropertyDescriptor(eventTarget, INPUT_SOURCE_STATE_KEY).value;
}

/**
 * Obtain a lease to the associated input source for the event target element.
 * 
 * @param {EventTarget} eventTarget The target element to listen to.
 */
function obtainInputSourceState(eventTarget)
{
    if (!hasAttachedInputSourceState(eventTarget))
    {
        let state = new InputSourceState([
            new Keyboard(eventTarget),
            new Mouse(eventTarget),
        ]);
        Object.defineProperty(eventTarget, INPUT_SOURCE_STATE_KEY, {
            value: {
                state: state,
                refs: 1
            },
            configurable: true,
        });
        return state;
    }
    else
    {
        let descriptor = Object.getOwnPropertyDescriptor(eventTarget, INPUT_SOURCE_STATE_KEY);
        descriptor.value.refs += 1;
        return descriptor.value.state;
    }
}

/**
 * Release a single lease on the input source for the event target element.
 * 
 * @param {EventTarget} eventTarget The target element.
 */
function releaseInputSourceState(eventTarget)
{
    if (hasAttachedInputSourceState(eventTarget))
    {
        let descriptor = Object.getOwnPropertyDescriptor(eventTarget, INPUT_SOURCE_STATE_KEY);
        descriptor.value.refs -= 1;
        if (descriptor.value.refs <= 0)
        {
            let state = descriptor.value.state;
            delete eventTarget[INPUT_SOURCE_STATE_KEY];
            state.destroy();
        }
    }
}
