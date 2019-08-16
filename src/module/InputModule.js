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

function Action(name, ...eventKeys)
{
    const input = new ActionInput(name, ...eventKeys);
    INPUT_MANAGER.getContext().mapping.register(input);
    return {
        input,
        get(consume = true)
        {
            const inputState = INPUT_MANAGER.currentState;
            if (inputState.hasAction(this.input.name))
            {
                return inputState.getAction(this.input.name, consume);
            }
            return false;
        }
    };
}

function State(name, ...downUpEventKeys)
{
    const inputs = [];
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
        const input = new StateInput(name, downEventKey, upEventKey);
        INPUT_MANAGER.getContext().mapping.register(input);
        inputs.push(input);
    }

    return {
        inputs,
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
}

function Range(name, eventKey, min = 0, max = 1)
{
    const input = new RangeInput(name, eventKey, min, max);
    INPUT_MANAGER.getContext().mapping.register(input);
    return {
        input,
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
}

export {
    INPUT_MANAGER,
    KEYBOARD,
    MOUSE,
    Action,
    State,
    Range
};