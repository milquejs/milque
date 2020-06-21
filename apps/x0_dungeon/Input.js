import { InputMapping } from './InputMapping.js';
import { Mouse, Keyboard } from './lib.js';

// TODO: Pos inputs are non-elegant
// TODO: multiple keys per input?

const INNER_HTML = `
<table>
    <thead>
        <tr>
            <th>Input</th>
            <th>Key</th>
            <th>Mod</th>
            <th>Value</th>
        </tr>
    </thead>
    <tbody>
    </tbody>
</table>
<slot></slot>`;
const INNER_STYLE = `
:host {
    display: inline-block;
}
slot {
    display: none;
}
table {
    border-collapse: collapse;
}
table, th, td {
    border: 1px solid gray;
}
th, td {
    padding: 5px 10px;
}
td {
    text-align: center;
}
kbd {
    display: inline-block;
    background-color: #EEEEEE;
    border-radius: 3px;
    border: 1px solid #B4B4B4;
    box-shadow: 0 1px 1px rgba(0, 0, 0, .2), 0 2px 0 0 rgba(255, 255, 255, .7) inset;
    color: #333333;
    font-size: 0.85em;
    font-weight: 700;
    line-height: 1;
    padding: 2px 4px;
    white-space: nowrap;
}
output {
    font-family: monospace;
    border-radius: 0.3em;
    padding: 3px;
}
.flash {
    animation: fadein 4s;
}
@keyframes fadein {
    0%, 10% { background-color: rgba(0, 0, 255, 0.3); }
    100% { background-color: rgba(0, 0, 255, 0); }
}
`;

const TEMPLATE_KEY = Symbol('template');
const STYLE_KEY = Symbol('style');

export class InputContext extends HTMLElement
{
    static get [TEMPLATE_KEY]()
    {
        let template = document.createElement('template');
        template.innerHTML = INNER_HTML;
        Object.defineProperty(this, TEMPLATE_KEY, { value: template });
        return template;
    }

    static get [STYLE_KEY]()
    {
        let style = document.createElement('style');
        style.innerHTML = INNER_STYLE;
        Object.defineProperty(this, STYLE_KEY, { value: style });
        return style;
    }

    /** @override */
    static get observedAttributes()
    {
        return ['strict', 'editable'];
    }

    constructor(inputMapping = null)
    {
        super();

        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(this.constructor[TEMPLATE_KEY].content.cloneNode(true));
        this.shadowRoot.appendChild(this.constructor[STYLE_KEY].cloneNode(true));

        this._tableBody = this.shadowRoot.querySelector('tbody');
        this._children = this.shadowRoot.querySelector('slot');
        this._tableInputs = {};

        this._mapping = inputMapping;

        this._inputs = {};
        this._inputKeys = {};
        this._keys = {};

        this.onInputEvent = this.onInputEvent.bind(this);

        if (inputMapping)
        {
            parseInputMapping(this, inputMapping);
        }
    }

    /** @override */
    connectedCallback()
    {
        if (this._mapping) return;
        this._mapping = {};

        let src = this.src;
        if (src)
        {
            fetch(src)
                .then(blob => blob.json())
                .then(data => {
                    let result = getInputMappingFromNodes(this, this._children.assignedNodes());
                    this._mapping = { ...data, ...result };
                    parseInputMapping(this, this._mapping);
                });
        }
        else
        {
            let result = getInputMappingFromNodes(this, this._children.assignedNodes());
            this._mapping = { ...result };
            parseInputMapping(this, this._mapping);
        }
    }

    get src() { return this.getAttribute('src'); }
    set src(value) { this.setAttribute('src', value); }

    get strict() { return this.hasAttribute('strict'); }
    set strict(value) { if (value) this.setAttribute('strict', ''); else this.removeAttribute('strict'); }

    attach(keyboardTarget, mouseTarget)
    {
        Keyboard.addInputEventListener(keyboardTarget, this.onInputEvent);
        Mouse.addInputEventListener(mouseTarget, this.onInputEvent);
        return this;
    }

    poll()
    {
        // Update all inputs to the current key's values.
        for(let inputName in this._inputs)
        {
            let flag = false;

            let input = this._inputs[inputName];
            let inputType = input.inputType;
            switch(inputType)
            {
                case 'action':
                    // Action should be any key value.
                    for(let inputKey of this._inputKeys[inputName])
                    {
                        let value = inputKey.value;
                        if (value)
                        {
                            flag = input.update(value, inputKey);
                            inputKey.consumeKey();
                            break;
                        }
                    }
                    break;
                case 'range':
                    // Range should be sum of keys.
                    let value = 0;
                    for(let inputKey of this._inputKeys[inputName])
                    {
                        value += inputKey.value;
                    }
                    flag = input.update(value, null);
                    break;
                default:
                    throw new Error('Unknown input type.');
            }

            if (flag)
            {
                let result;
                if (input.value)
                {
                    result = Number(input.value).toFixed(2);
                }
                else
                {
                    result = 0;
                }
                let element = this._tableInputs[inputName];
                element.textContent = result;
                let parent = element.parentNode;
                element.parentNode.removeChild(element);
                parent.appendChild(element);
            }
        }
    }

    onInputEvent(e)
    {
        let eventType = e.type;
        switch(eventType)
        {
            case 'key':
                {
                    const keyName = e.device + ':' + e.key;
                    if (keyName in this._keys)
                    {
                        let flag = false;
                        for(let key of this._keys[keyName])
                        {
                            if (key.updateKey(e, keyName))
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
                break;
            case 'pos':
                {
                    const params = [
                        'x',
                        'y',
                        'dx',
                        'dy'
                    ];
                    for(let param of params)
                    {
                        e.value = e[param];
                        const keyName = e.device + ':' + e.key + '.' + param;
                        if (keyName in this._keys)
                        {
                            let flag = false;
                            for(let key of this._keys[keyName])
                            {
                                if (key.updateKey(e, keyName))
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
                }
                break;
            default:
                throw new Error(`Unknown input event type '${eventType}'.`);
        }
    }

    getInput(inputName)
    {
        if (inputName in this._inputs)
        {
            return this._inputs[inputName];
        }
        else if (!this.strict)
        {
            let result = new Input(inputName, 'range');
            this._inputs[inputName] = result;
            return result;
        }
        else
        {
            throw new Error(`Cannot find input with name '${inputName}'.`);
        }
    }
}
window.customElements.define('input-context', InputContext);

class Input
{
    constructor(inputName, inputType)
    {
        this.inputName = inputName;
        this.inputType = inputType;

        this.value = 0;

        this._onchange = null;
        this._eventListeners = new Map();
    }

    update(value)
    {
        if (this.value !== value)
        {
            this.value = value;
            
            if (this._eventListeners.has('change'))
            {
                for(let listener of this._eventListeners.get('change'))
                {
                    listener.call(undefined, this);
                }
            }

            return true;
        }
        return false;
    }

    get onchange()
    {
        return this._onchange;
    }

    set onchange(callback)
    {
        if (this._onchange)
        {
            this.removeEventListener('change', this._onchange);
        }

        this._onchange = callback;
        this.addEventListener('change', callback);
    }

    addEventListener(event, listener)
    {
        if (this._eventListeners.has(event))
        {
            let listeners = this._eventListeners.get(event);
            listeners.push(listener);
        }
        else
        {
            this._eventListeners.set(event, [ listener ]);
        }
    }

    removeEventListener(event, listener)
    {
        if (this._eventListeners.has(event))
        {
            let listeners = this._eventListeners.get(event);
            listeners.splice(listeners.indexOf(listener), 1);
        }
    }
}

class InputKey
{
    constructor(keyName, keyEvent, scale)
    {
        this.keyName = keyName;
        this.keyEvent = keyEvent;
        this.scale = scale;

        this.value = 0;
    }

    consumeKey()
    {
        this.value = 0;
    }

    updateKey(e, keyName)
    {
        if (keyName === this.keyName)
        {
            if (this.keyEvent)
            {
                if (this.keyEvent === e.event)
                {
                    this.value = e.value * this.scale;
                }
            }
            else
            {
                switch(e.event)
                {
                    case 'down':
                        this.value = this.scale;
                        break;
                    case 'up':
                        this.value = 0;
                        break;
                    default:
                        this.value = e.value * this.scale;
                        break;
                }
            }
        }
    }
}

function getInputMappingFromNodes(inputContext, nodes)
{
    let result = {};
    for(let node of nodes)
    {
        if (node instanceof InputMapping)
        {
            let inputName = node.name;

            let keys;
            if (inputName in result)
            {
                keys = result[inputName];
            }
            else
            {
                result[inputName] = keys = [];
            }

            let inputType = node.type;
            switch(inputType)
            {
                case 'action':
                    keys.push({
                        key: node.key,
                        event: node.event,
                    });
                    break;
                case 'range':
                    keys.push({
                        key: node.key,
                        scale: node.scale,
                    });
                    break;
                default:
                    throw new Error('Unknown input type.');
            }
        }
    }
    return result;
}

function parseInputMapping(inputContext, inputMapping)
{
    for(let inputName in inputMapping)
    {
        let inputOptions = inputMapping[inputName];
        if (Array.isArray(inputOptions))
        {
            for(let inputOption of inputOptions)
            {
                parseInputOption(inputContext, inputName, inputOption);
                appendInputOption(inputContext, inputName, inputOption);
            }
        }
        else
        {
            parseInputOption(inputContext, inputName, inputOptions);
            appendInputOption(inputContext, inputName, inputOptions);
        }
    }
}

function evaluateInputOptionType(inputOption)
{
    if (typeof inputOption === 'object')
    {
        if ('type' in inputOption)
        {
            return inputOption.type;
        }
        else if ('scale' in inputOption)
        {
            return 'range';
        }
        else if ('event' in inputOption)
        {
            return 'action';
        }
        else
        {
            throw new Error(`Missing 'scale' or 'event' for input option '${inputName}'.`);
        }
    }
    else if (typeof inputOption === 'string')
    {
        return 'action';
    }
    else
    {
        throw new Error('Invalid type for input mapping option.');
    }
}

function appendInputOption(inputContext, inputName, inputOption)
{
    let row = document.createElement('tr');
    
    // Name
    {
        let inputCell = document.createElement('td');
        inputCell.textContent = inputName;
        inputCell.classList.add('name');
        row.appendChild(inputCell);
    }

    // Key
    {
        let keyCell = document.createElement('td');
        keyCell.classList.add('key');
        let keyLabel = document.createElement('kbd');
        keyLabel.textContent = inputOption.key;
        keyCell.appendChild(keyLabel);
        row.appendChild(keyCell);
    }

    // Mods
    {
        let modCell = document.createElement('td');
        let modSample = document.createElement('samp');
        let inputType = evaluateInputOptionType(inputOption);
        switch(inputType)
        {
            case 'action':
                modSample.textContent = inputOption.event;
                break;
            case 'range':
                modSample.textContent = Number(inputOption.scale).toFixed(2);
                break;
            default:
                modSample.textContent = '<?>';
        }
        modCell.classList.add('mod');
        modCell.appendChild(modSample);
        row.appendChild(modCell);
    }

    // Value
    if (!(inputName in inputContext._tableInputs))
    {
        let outputCell = document.createElement('td');
        let outputValue = document.createElement('output');
        outputValue.textContent = 0;
        outputValue.classList.add('flash');
        outputCell.classList.add('value');
        outputCell.appendChild(outputValue);
        row.appendChild(outputCell);
        inputContext._tableInputs[inputName] = outputValue;
    }
    else
    {
        let outputCell = document.createElement('td');
        outputCell.classList.add('value');
        row.appendChild(outputCell);
    }

    inputContext._tableBody.appendChild(row);
}

function parseInputOption(inputContext, inputName, inputOption)
{
    let inputType = evaluateInputOptionType(inputOption);
    switch(inputType)
    {
        case 'action':
            if (typeof inputOption === 'string')
            {
                parseActionOption(inputContext, inputName, { key: inputOption, event: 'down' });
            }
            else
            {
                parseActionOption(inputContext, inputName, inputOption);
            }
            break;
        case 'range':
            parseRangeOption(inputContext, inputName, inputOption);
            break;
        default:
            throw new Error(`Unknown input type '${inputType}'.`);
    }
}

function parseRangeOption(inputContext, inputName, inputOption)
{
    const { key, scale } = inputOption;

    // Update _inputs, _inputKeys, _keys
    let input;
    let inputKeys;
    if (inputName in inputContext._inputs)
    {
        input = inputContext._inputs[inputName];
        inputKeys = inputContext._inputKeys[inputName];

        if (input.inputType !== 'range')
        {
            throw new Error(`Cannot register mismatched 'range' type input for '${input.inputType}' type input '${inputName}'.`);
        }
    }
    else
    {
        input = new Input(inputName, 'range');
        inputKeys = [];

        inputContext._inputs[inputName] = input;
        inputContext._inputKeys[inputName] = inputKeys;
    }

    let keys;
    if (key in inputContext._keys)
    {
        keys = inputContext._keys[key];
    }
    else
    {
        keys = [];
        inputContext._keys[key] = keys;
    }
    
    let inputKey = new InputKey(key, null, scale);
    keys.push(inputKey);
    inputKeys.push(inputKey);
}

function parseActionOption(inputContext, inputName, inputOption)
{
    const { key, event } = inputOption;

    // Update _inputs, _inputKeys, _keys
    let input;
    let inputKeys;
    if (inputName in inputContext._inputs)
    {
        input = inputContext._inputs[inputName];
        inputKeys = inputContext._inputKeys[inputName];

        if (input.inputType !== 'action')
        {
            throw new Error(`Cannot register mismatched 'action' type input for '${input.inputType}' type input '${inputName}'.`);
        }
    }
    else
    {
        input = new Input(inputName, 'action');
        inputKeys = [];

        inputContext._inputs[inputName] = input;
        inputContext._inputKeys[inputName] = inputKeys;
    }

    let keys;
    if (key in inputContext._keys)
    {
        keys = inputContext._keys[key];
    }
    else
    {
        keys = [];
        inputContext._keys[key] = keys;
    }
    
    let inputKey = new InputKey(key, event, 1);
    keys.push(inputKey);
    inputKeys.push(inputKey);
}
