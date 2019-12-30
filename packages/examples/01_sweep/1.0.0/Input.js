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
    let result = new ActionInput(eventKeyString);
    inputs.push(result);
    return result;
}

export function createRange(eventKeyString)
{
    let result = new RangeInput(eventKeyString);
    inputs.push(result);
    return result;
}

export function createState(eventKeyMap)
{
    let result = new StateInput(eventKeyMap);
    inputs.push(result);
    return result;
}

export function handleEvent(eventKeyString, value)
{
    for(let i of inputs)
    {
        i.update(eventKeyString, value);
    }
}

class Input
{
    constructor(defaultValue)
    {
        this.prev = defaultValue;
        this.value = defaultValue;
        this.next = defaultValue;
    }

    update(eventKey, value)
    {
        this.next = value;
    }

    consume()
    {
        return this.next;
    }

    poll()
    {
        this.prev = this.value;
        this.value = this.next;
        this.next = this.consume();
        return this;
    }
}

class ActionInput extends Input
{
    constructor(eventKeyString)
    {
        super(false);

        this.eventKey = eventKeyString;
    }

    /** @override */
    consume() { return false; }

    /** @override */
    update(eventKey, value = true)
    {
        if (eventKey === this.eventKey)
        {
            this.next = value;
        }
    }
}

class RangeInput extends Input
{
    constructor(eventKeyString)
    {
        super(0);

        this.eventKey = eventKeyString;
    }

    /** @override */
    consume()
    {
        switch(this.eventKey)
        {
            case 'mouse[pos].dx':
            case 'mouse[pos].dy':
                return 0;
            case 'mouse[pos].x':
            case 'mouse[pos].y':
            default:
                return this.next;
        }
    }

    /** @override */
    update(eventKey, value = 1)
    {
        if (eventKey === this.eventKey)
        {
            this.next = value;
        }
    }
}

class StateInput extends Input
{
    constructor(eventKeyMap)
    {
        super(0);

        this.eventKeys = eventKeyMap;
    }

    /** @override */
    update(eventKey, value = true)
    {
        if (eventKey in this.eventKeys && value)
        {
            this.next = this.eventKeys[eventKey];
        }
    }
}
