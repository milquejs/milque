import InputState from './InputState.js';
import InputContext from './InputContext.js';
import InputMapping from './InputMapping.js';

import ActionInput from './context/ActionInput.js';
import StateInput from './context/StateInput.js';
import RangeInput from './context/RangeInput.js';

/**
 * Manages the input by context layers. To create a context, call registerContext() with
 * a unique context name. It is better practice to register all contexts at the beginning
 * and enable/disable individually. This way, the order of register is the same priority
 * order. Furthermore, you must register any Input objects created with the context.mapping.
 * To simplify this, a default context is already created for you (grab it with getContext()
 * with no args). Finally, call poll() each update loop to keep certain input states up to
 * date.
 * Inputs are created as 3 types: action, state, or range. Each of these have its own
 * associated class and take a name and other arguments.
 * For action inputs, it can take any number of event keys that will trigger the input.
 * For state inputs, it takes 2 event keys: the first for the down event and the other for the up event.
 * For range inputs, it takes 1 event key and requires a min and max bound.
 */
class InputManager
{
    constructor()
    {
        this.devices = {};

        this.contexts = new Map();
        this.currentState = new InputState();

        // Set default context
        this.contexts.set('default', new InputContext('default'));

        this.onInputEvent = this.onInputEvent.bind(this);
    }

    addDevice(inputDevice)
    {
        // TODO: What if multiple of the same TYPE of input device?
        this.devices[inputDevice.name] = inputDevice;
        inputDevice.addInputListener(this.onInputEvent);
    }

    removeDevice(inputDevice)
    {
        inputDevice.removeInputListener(this.onInputEvent);
        delete this.devices[inputDevice.name];
    }

    getDevice(inputDevice)
    {
        return this.devices[inputDevice.name];
    }

    clearDevices()
    {
        for(const key of Object.keys(this.devices))
        {
            const inputDevice = this.devices[key];
            inputDevice.removeInputListener(this.onInputEvent);
            delete this.devices[key];
        }
    }

    getDevices()
    {
        return Object.values(this.devices);
    }

    /**
     * For each update loop: poll first, update second.
     */
    poll()
    {
        // NOTE: States cant't update properly by themselves. This is because states may
        // have values that are passively set even though the associated input events may
        // not fire. For example, the down state of a key may first register as DOWN when
        // first pressed. But all frames between the press and release must also trigger as
        // DOWN even when no input events are fired. Therefore, we will manually trigger
        // state input events for all states that are active in the update loop.
        this.propagateActiveStateInputs();
    }

    propagateActiveStateInputs()
    {
        const dst = this.currentState;
        for(const context of this.contexts.values())
        {
            if (context.disabled) continue;
            
            for(const mappedInputs of context.mapping.values())
            {
                for(const mappedInput of mappedInputs)
                {
                    if (mappedInput instanceof StateInput)
                    {
                        if (mappedInput.active)
                        {
                            // Keep the mapped input active!
                            dst.setState(mappedInput.name, true);
                            // Only the first mapped input gets it due to priority.
                            break;
                        }
                    }
                }
            }
        }
    }

    onInputEvent(source, key, event, value = true, ...args)
    {
        const dst = this.currentState;
        const eventKey = InputMapping.toEventKey(source.name, key, event);
        for(const context of this.contexts.values())
        {
            if (context.disabled) continue;

            for(const mappedInput of context.mapping.get(eventKey))
            {
                const result = mappedInput.update(source, key, event, value, ...args);
                if (result !== null)
                {
                    if (mappedInput instanceof ActionInput)
                    {
                        dst.setAction(mappedInput.name, result);
                    }
                    else if (mappedInput instanceof StateInput)
                    {
                        dst.setState(mappedInput.name, result);
                    }
                    else if (mappedInput instanceof RangeInput)
                    {
                        dst.setRange(mappedInput.name, result);
                    }
                    else
                    {
                        throw new Error('Unknown input class.');
                    }

                    break;
                }
            }
        }
    }

    registerContext(contextName)
    {
        // Since order is preserved for maps, context priority is dependent on register order.
        const context = new InputContext(contextName);
        this.contexts.set(contextName, context);
        return this;
    }

    unregisterContext(contextName)
    {
        this.contexts.delete(contextName);
        return this;
    }

    getContext(contextName = 'default')
    {
        return this.contexts.get(contextName);
    }
}

export default InputManager;