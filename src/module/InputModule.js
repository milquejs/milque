import MathHelper from '../util/MathHelper.js';
import InputManager from '../input/InputManager.js';

import InputMapping from '../input/InputMapping.js';
import ActionInput from '../input/context/ActionInput.js';
import StateInput from '../input/context/StateInput.js';
import RangeInput from '../input/context/RangeInput.js';

import Keyboard from '../input/device/Keyboard.js';
import Mouse from '../input/device/Mouse.js';

const INPUT_MANAGER = new InputManager();

const KEYBOARD = new Keyboard(window);
const MOUSE = new Mouse(window, false);
INPUT_MANAGER.addDevice(KEYBOARD);
INPUT_MANAGER.addDevice(MOUSE);

function Action(name = MathHelper.uuid(), ...args)
{
    const result = {
        name,
        input: null,
        attach(...eventKeys)
        {
            if (this.input) throw new Error('Already attached input to source.');
            this.input = new ActionInput(this.name, ...eventKeys);
            INPUT_MANAGER.getContext().mapping.register(this.input);
            return this;
        },
        get(consume = true)
        {
            if (this.input)
            {
                const inputState = INPUT_MANAGER.currentState;
                if (inputState.hasAction(this.input.name))
                {
                    return inputState.getAction(this.input.name, consume);
                }
            }
            return false;
        }
    };

    if (args.length > 0)
    {
        result.attach(...args);
    }
    
    return result;
}

function State(name = MathHelper.uuid(), ...args)
{
    const result = {
        name,
        inputs: null,
        attach(...downUpEventKeys)
        {
            if (this.inputs) throw new Error('Already attached input to source.');
            this.inputs = [];
            for(const downUpEventKey of downUpEventKeys)
            {
                let downEventKey;
                let upEventKey;
                if (Array.isArray(downUpEventKey))
                {
                    downEventKey = downUpEventKey[0];
                    upEventKey = downUpEventKey[1];
                }
                else
                {
                    const [sourceName, key] = InputMapping.fromEventKey(downUpEventKey);
                    downEventKey = InputMapping.toEventKey(sourceName, key, 'down');
                    upEventKey = InputMapping.toEventKey(sourceName, key, 'up');
                }
                const input = new StateInput(this.name, downEventKey, upEventKey);
                INPUT_MANAGER.getContext().mapping.register(input);
                this.inputs.push(input);
            }
            return this;
        },
        get(consume = true)
        {
            const inputState = INPUT_MANAGER.currentState;
            if (inputState.hasState(this.inputs[0].name))
            {
                return inputState.getState(this.inputs[0].name, consume);
            }
            return false;
        }
    };

    if (args.length > 0)
    {
        result.attach(...args);
    }

    return result;
}

function Range(name = MathHelper.uuid(), ...args)
{
    const result = {
        name,
        input: null,
        attach(eventKey, fromMin = 0, fromMax = 1, toMin = fromMin, toMax = fromMax)
        {
            if (this.input) throw new Error('Already attached input to source.');
            this.input = new RangeInput(this.name, eventKey, min, max, toMin, toMax);
            INPUT_MANAGER.getContext().mapping.register(this.input);
            return this;
        },
        get(consume = true)
        {
            const inputState = INPUT_MANAGER.currentState;
            if (inputState.hasRange(this.input.name))
            {
                return inputState.getRange(this.input.name, consume);
            }
            return 0;
        }
    };

    if (args.length > 0)
    {
        result.attach(...args);
    }

    return result;
}

export {
    INPUT_MANAGER,
    KEYBOARD,
    MOUSE,
    Action,
    State,
    Range,
};