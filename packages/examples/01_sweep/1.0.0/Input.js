import { Mouse } from './util/Mouse.js';
import { Keyboard } from './util/Keyboard.js';

export var KEYBOARD = new Keyboard();
export var MOUSE = new Mouse();

var inputs = [];

export function attachSource(element)
{
    KEYBOARD.setEventHandler(handleEvent).attach();
    MOUSE.setEventHandler(handleEvent).attach(element.getCanvas());
}

export function createAction(input)
{
    const result = {
        type: 'action',
        input,
        value: false,
        next: false,
        poll()
        {
            this.value = this.next;
            this.next = consumeInput(this.input, this.next);
        }
    };
    inputs.push(result);
    return result;
}

export function createRange(input)
{
    const result = {
        type: 'range',
        input,
        value: 0,
        next: 0,
        poll()
        {
            this.value = this.next;
            this.next = consumeInput(this.input, this.next);
        }
    };
    inputs.push(result);
    return result;
}

export function createState(inputMap)
{
    const result = {
        type: 'state',
        inputs: inputMap,
        value: 0,
        next: 0,
        poll()
        {
            this.value = this.next;
        }
    };
    inputs.push(result);
    return result;
}

export function handleEvent(input, value)
{
    for(let i of inputs)
    {
        if (i.type === 'state')
        {
            if (input in i.inputs) i.next = i.inputs[input];
        }
        else
        {
            if (i.input === input) i.next = value;
        }
    }
}

function consumeInput(input, next)
{
    switch(input)
    {
        case 'mouse[pos].x':
        case 'mouse[pos].y':
            return next;
        case 'mouse[pos].dx':
        case 'mouse[pos].dy':
            return 0;
        default:
            return false;
    }
}
