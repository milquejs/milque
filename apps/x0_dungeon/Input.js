import { Mouse, Keyboard } from './lib.js';

export class InputContext
{
    constructor(inputMapping)
    {
        this.inputMapping = inputMapping;

        this._actions = {};
        this._ranges = {};
        this._keys = {};

        for(let inputName of Object.keys(inputMapping))
        {
            let inputOptions = inputMapping[inputName];
            if (Array.isArray(inputOptions))
            {
                for(let inputOption of inputOptions)
                {
                    parseInputOption(this, inputName, inputOption);
                }
            }
            else
            {
                parseInputOption(this, inputName, inputOptions);
            }
        }

        this.onInputEvent = this.onInputEvent.bind(this);
    }

    attach(keyboardTarget, mouseTarget)
    {
        Keyboard.addInputEventListener(keyboardTarget, this.onInputEvent);
        Mouse.addInputEventListener(mouseTarget, this.onInputEvent);
        return this;
    }

    poll()
    {
        for(let inputName of Object.keys(this._actions))
        {
            this._actions[inputName].poll();
        }

        for(let inputName of Object.keys(this._ranges))
        {
            this._ranges[inputName].poll();
        }
    }

    onInputEvent(e)
    {
        const keyName = e.device + ':' + e.key;
        if (keyName in this._keys)
        {
            let flag = false;
            for(let input of this._keys[keyName])
            {
                if (input.update(e))
                {
                    flag = true;
                }
            }
            if (flag)
            {
                return true;
            }
        }
    }

    getAction(inputName)
    {
        return this._actions[inputName];
    }

    getRange(inputName)
    {
        return this._ranges[inputName];
    }
}

function createAction(inputContext, inputName, keyName, keyEvent)
{
    let result = new ActionInput(inputName, keyName, keyEvent);
    inputContext._actions[inputName] = result;
    if (keyName in inputContext._keys)
    {
        inputContext._keys[keyName].push(result);
    }
    else
    {
        inputContext._keys[keyName] = [ result ];
    }
    return result;
}

function createRange(inputContext, inputName, keyName, scale)
{
    let result;
    if (keyName.indexOf('pos', keyName.indexOf(':') + 1) >= 0)
    {
        let posName = keyName.substring(i + 5);
        result = new PosRangeInput(inputName, keyName, posName, scale);
    }
    else
    {
        result = new RangeInput(inputName, keyName, scale);
    }

    inputContext._ranges[inputName] = result;
    if (keyName in inputContext._keys)
    {
        inputContext._keys[keyName].push(result);
    }
    else
    {
        inputContext._keys[keyName] = [ result ];
    }
    return result;
}

function parseInputOption(inputContext, inputName, inputOption)
{
    if (typeof inputOption === 'object')
    {
        if ('scale' in inputOption)
        {
            // Range
            const { key, scale } = inputOption;
            
            createRange(inputContext, inputName, key, scale);
        }
        else if ('event' in inputOption)
        {
            // Action
            const { key, event } = inputOption;
            createAction(inputContext, inputName, key, event);
        }
        else
        {
            throw new Error(`Missing 'scale' or 'event' for input option '${inputName}'.`);
        }
    }
    else if (typeof inputOption === 'string')
    {
        // Assumes to be an action.
        createAction(inputContext, inputName, inputOption, 'down');
    }
    else
    {
        throw new Error('Invalid type for input mapping option.');
    }
}

class Input
{
    constructor(inputName, keyName)
    {
        this.inputName = inputName;
        this.keyName = keyName;

        this._value = 0;
        this._next = 0;
    }

    /** @abstract */
    update(e)
    {
        this._next = e.value;
    }

    /** @abstract */
    poll()
    {
        let prev = this._value;
        this._value = this._next;
        this._next = 0;
    }

    get value()
    {
        return this._value;
    }
}

class ActionInput extends Input
{
    constructor(inputName, keyName, keyEvent)
    {
        super(inputName, keyName);

        this.keyEvent = keyEvent;
    }

    /** @override */
    update(e)
    {
        if (e.type === 'key')
        {
            if (e.event === this.keyEvent)
            {
                this._next = e.value;
                return true;
            }
        }
    }

    /** @override */
    poll()
    {
        let prev = this._value;
        this._value = this._next;
        this._next = 0;
    }
}

class RangeInput extends Input
{
    constructor(inputName, keyName, scale)
    {
        super(inputName, keyName);

        this.scale = scale;
    }

    /** @override */
    update(e)
    {
        if (e.type === 'key')
        {
            switch(e.event)
            {
                case 'down':
                    this._next = e.value * this.scale;
                    break;
                case 'up':
                    this._next = 0;
                    break;
                default:
                    this._next = e.value * this.scale;
            }
            return true;
        }
    }

    /** @override */
    poll()
    {
        let prev = this._value;
        this._value = this._next;
    }
}

class PosRangeInput extends RangeInput
{
    constructor(inputName, keyName, posName, scale)
    {
        super(inputName, keyName, scale);

        this.posName = posName;
    }

    /** @override */
    update(e)
    {
        if (e.type ===  'pos')
        {
            switch(this.posName)
            {
                case 'x':
                    this._next = this._value = e.x * this.scale;
                    break;
                case 'y':
                    this._next = this._value = e.y * this.scale;
                    break;
                case 'dx':
                    this._next = this._value = e.dx * this.scale;
                    break;
                case 'dy':
                    this._next = this._value = e.dy * this.scale;
                    break;
            }
        }
    }
}
