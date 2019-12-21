import { Keyboard, Mouse } from './input/InputDevices.js';

export const KEYBOARD = new Keyboard().setEventHandler(handleEvent);
export const MOUSE = new Mouse().setEventHandler(handleEvent);

let inputs = [];

export function clear()
{
    inputs.length = 0;
}

export function poll()
{
    // TODO: Nothing as of yet...
}

export function createInput(key, onChange = undefined)
{
    let result = { key, value: false, prev: false, onChange };
    inputs.push(result);
    return result;
}

export function handleEvent(eventKey, value)
{
    const key = eventKey.substring(eventKey.indexOf('[') + 1, eventKey.indexOf(']'));
    const mode = eventKey.substring(eventKey.indexOf('.') + 1);
    value = mode === 'down' || mode === 'repeat';

    for(let input of inputs)
    {
        if (input.key.includes(key) || input.key.includes('*'))
        {
            let prev = input.value;
            if (prev !== value)
            {
                input.value = value;
                input.prev = prev;
                if (input.onChange) input.onChange(value, prev);
            }
        }
    }
}
