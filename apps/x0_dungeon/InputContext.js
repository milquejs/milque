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
            <th>Modifier</th>
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

        this._mapping = inputMapping;

        this._actions = {};
        this._ranges = {};

        this._keys = {};
        this._paraKeys = {};

        this.onInputEvent = this.onInputEvent.bind(this);

        if (inputMapping)
        {
            this._mapping = {};
            for(let inputName of Object.keys(inputMapping))
            {
                let inputOptions = inputMapping[inputName];
                if (Array.isArray(inputOptions))
                {
                    for(let inputOption of inputOptions)
                    {
                        parseInputOption(this, inputName, inputOption);
                        appendInputOption(this, inputName, inputOption);
                    }
                }
                else
                {
                    parseInputOption(this, inputName, inputOptions);
                    appendInputOption(this, inputName, inputOptions);
                }
            }
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
                    this._mapping = data;

                    for(let inputName of Object.keys(data))
                    {
                        let inputOptions = data[inputName];
                        if (Array.isArray(inputOptions))
                        {
                            for(let inputOption of inputOptions)
                            {
                                parseInputOption(this, inputName, inputOption);
                                appendInputOption(this, inputName, inputOption);
                            }
                        }
                        else
                        {
                            parseInputOption(this, inputName, inputOptions);
                            appendInputOption(this, inputName, inputOptions);
                        }
                    }
                })
                .then(() => {
                    processChildren(this);
                });
        }
        else
        {
            processChildren(this);
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
        if (e.type === 'key')
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
        else
        {
            const keyName = e.device + ':' + e.key;
            if (keyName in this._paraKeys)
            {
                let params = this._paraKeys[keyName];
                switch(e.type)
                {
                    case 'pos':
                        if ('x' in params)
                        {
                            e.value = e.x;
                            for(let input of params.x)
                            {
                                input.update(e);
                            }
                        }
                        if ('y' in params)
                        {
                            e.value = e.y;
                            for(let input of params.y)
                            {
                                input.update(e);
                            }
                        }
                        if ('dx' in params)
                        {
                            e.value = e.dx;
                            for(let input of params.dx)
                            {
                                input.update(e);
                            }
                        }
                        if ('dy' in params)
                        {
                            e.value = e.dy;
                            for(let input of params.dy)
                            {
                                input.update(e);
                            }
                        }
                        break;
                    default:
                        throw new Error(`Unknown input event type '${e.type}'.`);
                }
            }
        }
    }

    getAction(inputName)
    {
        if (inputName in this._actions)
        {
            return this._actions[inputName];
        }
        else if (!this.strict)
        {
            let result = new ActionInput(inputName, '');
            this._actions[inputName] = result;
            appendInputOption(this, inputName, result);
            return result;
        }
        else
        {
            throw new Error(`Cannot find input action with name '${inputName}'.`);
        }
    }

    getRange(inputName)
    {
        if (inputName in this._ranges)
        {
            return this._ranges[inputName];
        }
        else if (!this.strict)
        {
            let result = new RangeInput(inputName, 0);
            this._ranges[inputName] = result;
            appendInputOption(this, inputName, result);
            return result;
        }
        else
        {
            throw new Error(`Cannot find input range with name '${inputName}'.`);
        }
    }
}
window.customElements.define('input-context', InputContext);

function processChildren(inputContext)
{
    for(let node of inputContext._children.assignedNodes())
    {
        if (node instanceof InputMapping)
        {
            parseInputOption(inputContext, node.name, node);
            appendInputOption(inputContext, node.name, node);
        }
    }
}

function appendInputOption(inputContext, inputName, inputOption)
{
    let row = document.createElement('tr');
    let nameData = document.createElement('td');
    let inputData = document.createElement('td');
    let keyLabel = document.createElement('kbd');
    let optData = document.createElement('td');
    let optLabel = document.createElement('samp');
    let valueData = document.createElement('td');
    let valueValue = document.createElement('output');

    let inputType = evalInputOptionType(inputOption);
    switch(inputType)
    {
        case 'action':
            optLabel.textContent = inputOption.event;
            break;
        case 'range':
            optLabel.textContent = Number(inputOption.scale).toFixed(2);
            break;
        default:
            optLabel.textContent = '<?>';
    }

    nameData.textContent = inputName;
    keyLabel.textContent = inputOption.key;
    valueValue.textContent = 0;

    inputData.appendChild(keyLabel);
    if (inputOption.alt) {
        let altLabel = document.createElement('kbd');
        altLabel.textContent = inputOption.alt;
        inputData.appendChild(altLabel);
    }
    optData.appendChild(optLabel);
    valueData.appendChild(valueValue);
    row.appendChild(nameData);
    row.appendChild(inputData);
    row.appendChild(optData);
    row.appendChild(valueData);
    inputContext._tableBody.appendChild(row);
}

function evalInputOptionType(inputOption)
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

function parseInputOption(inputContext, inputName, inputOption)
{
    let inputType = evalInputOptionType(inputOption);
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
    const { key: keyName, scale } = inputOption;
    const deviceIndex = keyName.indexOf(':');
    const paramIndex = keyName.indexOf('.', deviceIndex + 1);

    let key;
    let param;
    if (paramIndex >= 0)
    {
        key = keyName.substring(0, paramIndex);
        param = keyName.substring(paramIndex + 1);
    }
    else
    {
        key = keyName;
        param = null;
    }

    let prev;
    let next;
    if (inputName in inputContext._actions)
    {
        throw new Error(`Cannot register mismatched range input type for action input '${inputName}'.`);
    }
    else if (inputName in inputContext._ranges)
    {
        prev = inputContext._ranges[inputName];
        next = prev;

        if (!(prev instanceof RangeInput))
        {
            throw new Error(`Cannot register another input '${inputName}' with mismatched type.`);
        }
    }
    else
    {
        prev = null;
        next = new RangeInput(inputName, scale);
    }

    if (param)
    {
        if (key in inputContext._paraKeys)
        {
            let params = inputContext._paraKeys[key];
            if (param in params)
            {
                let keys = params[param];
                if (prev && keys.includes(prev))
                {
                    throw new Error(`Input '${inputName}' is already registered to '${key}.${param}'.`);
                }
                else
                {
                    inputContext._paraKeys[key][param].push(next);
                }
            }
            else
            {
                inputContext._paraKeys[key][param] = [ next ];
            }
        }
        else
        {
            inputContext._paraKeys[key] = { [param]: [ next ] };
        }
    }
    else if (key in inputContext._keys)
    {
        let keys = inputContext._keys[key];
        if (prev && keys.includes(prev))
        {
            throw new Error(`Input '${inputName}' is already registered to '${key}'.`);
        }
        else
        {
            inputContext._keys[key].push(next);
        }
    }
    else
    {
        inputContext._keys[key] = [ next ];
    }

    inputContext._ranges[inputName] = next;
}

function parseActionOption(inputContext, inputName, inputOption)
{
    const { key, event } = inputOption;

    let prev;
    let next;
    if (inputName in inputContext._ranges)
    {
        throw new Error(`Cannot register mismatched action input type for range input '${inputName}'.`);
    }
    else if (inputName in inputContext._actions)
    {
        prev = inputContext._actions[inputName];
        next = prev;
    }
    else
    {
        prev = null;
        next = new ActionInput(inputName, event)
    }
    
    if (key in inputContext._keys)
    {
        let keys = inputContext._keys[key];
        if (prev && keys.includes(prev))
        {
            throw new Error(`Input '${inputName}' is already registered to '${key}'.`);
        }
        else
        {
            inputContext._keys[key].push(next);
        }
    }
    else
    {
        inputContext._keys[key] = [ next ];
    }

    inputContext._actions[inputName] = next;
}

class Input
{
    constructor(inputName)
    {
        this.inputName = inputName;

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
    constructor(inputName, keyEvent)
    {
        super(inputName);

        this.keyEvent = keyEvent;
    }

    /** @override */
    update(e)
    {
        if (e.event === this.keyEvent)
        {
            this._next = e.value;
            return true;
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
    constructor(inputName, scale)
    {
        super(inputName);

        this.scale = scale;
    }

    /** @override */
    update(e)
    {
        switch(e.event)
        {
            case 'down':
                this._next += e.value * this.scale;
                break;
            case 'up':
                this._next -= this.scale;
                break;
            default:
                this._next = e.value * this.scale;
        }
        return true;
    }

    /** @override */
    poll()
    {
        let prev = this._value;
        this._value = this._next;
    }
}
