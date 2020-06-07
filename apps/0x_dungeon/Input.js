import { Mouse, Keyboard } from '../../packages/input/src/index.js';

function insertKeyInput(out, inputName, keyName, useMeta)
{
    let { device, key, ...metaKeys } = parseKeyName(keyName, useMeta);

    let deviceKeys;
    if (!(device in out))
    {
        deviceKeys = {};
        out[device] = deviceKeys;
    }
    else
    {
        deviceKeys = out[device];
    }

    let keys;
    if (!(key in deviceKeys))
    {
        keys = {};
        deviceKeys[key] = keys;
    }
    else
    {
        keys = deviceKeys[key];
    }

    let result;
    if (useMeta)
    {
        result = metaKeys;
    }
    else
    {
        result = {};
    }

    if (!(inputName in keys))
    {
        keys[inputName] = result;
    }
    else
    {
        throw new Error(`Input '${inputName}' is already registered.`);
    }

    return result;
}

function createKeyMap(jsonData)
{
    let result = {};

    for(let [inputName, inputOpts] of Object.keys(jsonData))
    {
        if (Array.isArray(inputOpts))
        {
            for(let keyName of inputOpts)
            {
                if (typeof keyName === 'string')
                {
                    let opts = insertKeyInput(result, inputName, keyName, true);
                    opts.type = 'action';
                }
                else
                {
                    throw new Error(`Unknown type for action input option values '${inputName}'.`);
                }
            }
        }
        else if (typeof inputOpts === 'string')
        {
            let opts = insertKeyInput(result, inputName, inputOpts, true);
            opts.type = 'action';
        }
        else if (typeof inputOpts === 'object')
        {
            for(let keyName of Object.keys(inputOpts))
            {
                let scale = inputOpts[keyName];
                let opts = insertKeyInput(result, inputName, keyName, false);
                opts.scale = scale;
                opts.type = 'range';
            }
        }
        else
        {
            throw new Error(`Unknown type for input option '${inputName}'.`);
        }
    }

    return result;
}

class InputMapping
{
    static create(jsonData)
    {
        let { actions = {}, ranges = {} } = jsonData;

        let result = {
            keys: createKeyMap({ ...actions, ...ranges }),
            inputs: {
                actions,
                ranges,
            },
        };
        return result;
    }

    static parse(string)
    {
        return InputMapping.create(JSON.parse(string));
    }

    static stringify(inputMapping)
    {
        return JSON.stringify(InputMapping.objectify(inputMapping));
    }

    static objectify(inputMapping)
    {
        return {
            actions: inputMapping.inputs.actions,
            ranges: inputMapping.inputs.ranges,
        };
    }

    static hasInputForKey(inputMapping, device, key)
    {
        if (device in inputMapping.keys)
        {
            let deviceKeys = inputMapping.keys[device];
            return key in deviceKeys;
        }

        return false;
    }

    static getInputsForKey(inputMapping, device, key)
    {
        return inputMapping.keys[device][key];
    }
}

const keyMap = {
    'key:KeyA': 1,
    'key:KeyW': 1,
};

class KeyState
{
    constructor(keyMap)
    {
        this.keys = {};
        this.values = {};
    }

    update(e)
    {
        let keyName = this.getKeyName(device, key);
        switch(event)
        {
            case 'down':
                this.setKeyValue();
                break;
        }
    }

    setKeyValue(keyName, value)
    {

    }

    getKeyValue(keyName)
    {

    }

    getKeyName(device, key)
    {

    }
}

class InputState
{
    constructor(inputMapping)
    {
        this.inputMapping = inputMapping;

        let actionInputs = {};
        let rangeInputs = {};

        for(let action of inputMapping.actions)
        {

        }
        
        this.actionInputs = {};
        this.rangeInputs = {};
    }

    destroy()
    {

    }

    update(device, key, event, value)
    {
        let inputs = InputMapping.getInputsForKey(device, key);

        for(let inputName of Object.keys(inputs))
        {
            let opts = inputs[inputName];
            switch(opts.type)
            {
                case 'action':
                    ActionInput.update(opts, this.actionInputs[inputName], event, value);
                    break;
                case 'range':
                    RangeInput.update(opts, this.rangeInputs[inputName], event, value);
                    break;
                default:
                    throw new Error(`Unknown registered input type '${opts.type}'.`)
            }
        }
    }

    poll()
    {

    }
}

class InputContext
{
    constructor(inputMapping)
    {
        this.inputMapping = inputMapping;
        this.inputState = null;
        this.eventTarget = null;
        this.disabled = false;

        this.onDeviceInput = this.onDeviceInput.bind(this);
    }

    attach(eventTarget)
    {
        if (this.eventTarget)
        {
            throw new Error('Input context already attached to another event target.');
        }

        if (eventTarget)
        {
            this.inputState = new InputState(this.inputMapping);

            Keyboard.addInputEventListener(eventTarget, this.onDeviceInput);
            Mouse.addInputEventListener(eventTarget, this.onDeviceInput);
    
            this.eventTarget = eventTarget;
        }

        return this;
    }

    detach()
    {
        if (!this.eventTarget)
        {
            throw new Error('Cannot detach input context not yet attached to an event target.');
        }

        let eventTarget = this.eventTarget;
        this.eventTarget = null;

        Keyboard.removeInputEventListener(eventTarget, this.onDeviceInput);
        Mouse.removeInputEventListener(eventTarget, this.onDeviceInput);

        let inputState = this.inputState;
        this.inputState = null;
        
        inputState.destroy();

        return this;
    }

    enable()
    {
        this.disabled = false;
        return this;
    }

    disable()
    {
        this.disabled = true;
        return this;
    }

    toggle(force = !this.disabled)
    {
        this.disabled = force;
        return this;
    }

    poll()
    {
        this.inputState.poll();
    }

    getAction(inputName)
    {
        return this.inputState.getAction(inputName);
    }

    getRange(inputName)
    {
        return this.inputState.getRange(inputName);
    }

    onDeviceInput(e)
    {
        const { device, key, event, value } = e;

        this.inputState.update(device, key, event, value);
    }
}

class ActionInput
{
    static update(input, action, event, value)
    {
        switch(event)
        {
            case 'down':
                action.next = 1 * value;
                break;
            case 'up':
                action.next = -1 * value;
                break;
            default:
                action.next = value;
        }
    }

    static poll(action)
    {
        let prev = action.value;
        let next = action.next;
        action.value = next;
        action.next = 0;

        if (prev !== next)
        {
            action.down = next >= 0;
        }
    }

    constructor(context)
    {
        this.context = context;
        this.next = 0;
        this.value = 0;
        this.down = false;
    }

    isPressed()
    {
        return this.value > 0;
    }

    isReleased()
    {
        return this.value < 0;
    }

    isDown()
    {
        return this.down;
    }

    isUp()
    {
        return !this.down;
    }
}

class RangeInput
{
    static update(input, range, event, value)
    {
        switch(event)
        {
            case 'down':
                range.value += value * input.scale;
                break;
            case 'up':
                range.value += -1 * value * input.scale;
                break;
            default:
                range.value += value * input.scale;
        }
    }

    static poll()
    {
        let prev = action.value;
        let next = action.next;
        action.value = next;
        action.next = 0;

        if (prev !== next)
        {
            action.down = next >= 0;
        }
    }

    constructor(context)
    {
        this.context = context;
        this.value = 0;
    }

    getValue()
    {
        return this.value;
    }
}

function updateInput(input, value)
{
    input.value = value;
}

function pollInput(input)
{
    let prev = input.value;
    let next = input.next;
    input.value = next;
    input.next = 0;
}

function createInput()
{
    return {
        next: 0,
        value: 0,
    };
}

function parseKeyName(keyName, useMeta = true)
{
    let keyString = keyName.trim();
    let separator = keyString.indexOf(':');
    let metaSeparator = keyString.indexOf('^');

    let keyEndSeparator;
    if (!useMeta || metaSeparator < 0 || keyString.length <= metaSeparator + 1)
    {
        metaSeparator = -1;
        keyEndSeparator = keyString.length;
    }
    else if (keyString.charAt(metaSeparator + 1) === '^')
    {
        keyEndSeparator = metaSeparator;
        metaSeparator = metaSeparator + 1;
    }
    else
    {
        keyEndSeparator = metaSeparator;
    }

    let device = keyString.substring(0, separator);
    let key = keyString.substring(separator + 1, keyEndSeparator);
    let control = false;
    let shift = false;
    let alt = false;

    if (metaSeparator >= 0)
    {
        let metaString = keyString.substring(metaSeparator + 1);

        let metaKey;
        do
        {
            metaSeparator = metaString.indexOf('^');

            if (metaSeparator < 0)
            {
                metaKey = metaString;
            }
            else
            {
                metaKey = metaString.substring(0, metaSeparator);
                metaString = metaString.substring(metaSeparator + 1);
            }

            switch(metaKey)
            {
                case 'Control':
                    control = true;
                    break;
                case 'Shift':
                    shift = true;
                    break;
                case 'Alt':
                    alt = true;
                    break;
                default:
                    throw new Error(`Unsupported meta key '${metaKey}'.`)
            }
        }
        while(metaSeparator >= 0);
    }

    return { device, key, control, shift, alt };
}
