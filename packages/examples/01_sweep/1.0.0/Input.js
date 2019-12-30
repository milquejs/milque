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

export function createContext()
{
    return {
        actions: new Map(),
        ranges: new Map(),
        states: new Map(),
        registerAction(name, eventKeyString)
        {
            let result = createAction(eventKeyString);
            this.actions.set(name, result);
            return result;
        },
        registerRange(name, eventKeyString)
        {
            let result = createRange(eventKeyString);
            this.ranges.set(name, result);
            return result;
        },
        registerState(name, eventKeyMap)
        {
            let result = createState(eventKeyMap);
            this.states.set(name, result);
            return result;
        },
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
        }
    };
}

export function createAction(eventKeyString)
{
    const result = {
        type: 'action',
        input: eventKeyString,
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

export function createRange(eventKeyString)
{
    const result = {
        type: 'range',
        input: eventKeyString,
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

export function createState(eventKeyMap)
{
    const result = {
        type: 'state',
        inputs: eventKeyMap,
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
