import { Mouse } from './device/Mouse.js';
import { Keyboard } from './device/Keyboard.js';

import { Input } from './Input.js';
import { InputKey } from './InputKey.js';

const INNER_HTML = `
<table>
    <thead>
        <tr class="header">
            <th id="title" colspan=3>input-context</th>
            <th id="poll">&nbsp;</th>
        </tr>
        <tr class="hint">
            <th>input</th>
            <th>key</th>
            <th>mod</th>
            <th>value</th>
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
#poll {
    position: relative;
    font-size: 0.9em;
}
#poll:after {
    content: "(poll)";
    position: absolute;
    left: 0;
    right: 0;
    z-index: -1;
    opacity: 0.1;
    font-family: monospace;
    letter-spacing: 3px;
    overflow: hidden;
}
.hint > th {
    font-size: 0.5em;
    font-family: monospace;
    padding: 0 10px;
    letter-spacing: 3px;
    background-color: #AAA;
    color: #666666;
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
        // NOTE: This condition is only really used for parameterized key events.
        if (keyName === this.keyName)
        {
            if (this.keyEvent)
            {
                if (this.keyEvent === e.event)
                {
                    this.value = e.value * this.scale;
                    return true;
                }
            }
            else
            {
                switch(e.event)
                {
                    case 'down':
                        this.value = this.scale;
                        return true;
                    case 'up':
                        this.value = 0;
                        return true;
                    default:
                        this.value = e.value * this.scale;
                        return;
                }
            }
        }
    }
}

const NONE_POLL_TEXT = '✗';
const ACTIVE_POLL_TEXT = '✓';

const TEMPLATE_KEY = Symbol('template');
const STYLE_KEY = Symbol('style');

const POLL_WARNING_TIME = 3000;

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
        return [
            'for',
            'strict',
            'onattach',
            'ondetach',
            // ...listening for built-in attribs...
            'id',
            'class',
        ];
    }

    constructor(inputMap = null)
    {
        super();

        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(this.constructor[TEMPLATE_KEY].content.cloneNode(true));
        this.shadowRoot.appendChild(this.constructor[STYLE_KEY].cloneNode(true));

        this._onattach = null;
        this._ondetach = null;

        this._titleElement = this.shadowRoot.querySelector('#title');
        this._pollElement = this.shadowRoot.querySelector('#poll');

        this._tableBody = this.shadowRoot.querySelector('tbody');
        this._children = this.shadowRoot.querySelector('slot');
        this._tableInputs = {};

        this._lastPollTime = 0;
        this._pollWarningTimeoutHandle = 0;
        this._animationFrameHandle = 0;

        this._inputTarget = null;
        this._inputMap = inputMap;
        this._inputs = {};
        this._inputKeys = {};
        this._keys = {};

        this.onInputEvent = this.onInputEvent.bind(this);
        this.onAnimationFrame = this.onAnimationFrame.bind(this);

        if (inputMap)
        {
            parseInputMapping(this, inputMap);
        }
    }

    /** @override */
    connectedCallback()
    {
        if (!this.hasAttribute('for')) this.setAttribute('for', '');

        // Setup keys and inputs from the input mapping
        if (!this._inputMap)
        {
            this._inputMap = {};

            const childInputMap = InputKey.toInputMap(this._children.assignedNodes());
            const inputMapSource = this.src;
    
            if (inputMapSource)
            {
                fetch(inputMapSource)
                    .then(blob => blob.json())
                    .then(data => {
                        this._inputMap = { ...data, ...childInputMap };
                        parseInputMapping(this, this._inputMap);
                    });
            }
            else
            {
                this._inputMap = { ...childInputMap };
                parseInputMapping(this, this._inputMap);
            }
        }

        // Check to see if polling cause it is easy to forget it :P
        this._lastPollTime = 0;
        this._pollWarningTimeoutHandle = setTimeout(() => {
            if (this._lastPollTime <= 0)
            {
                this._pollElement.textContent = NONE_POLL_TEXT;
                console.warn('[INPUT] No input updated. Did you forget to poll() the input context?');
            }
            else
            {
                this._pollElement.textContent = ACTIVE_POLL_TEXT;
            }
        }, POLL_WARNING_TIME);

        this._animationFrameHandle = requestAnimationFrame(this.onAnimationFrame);
    }

    /** @override */
    disconnectedCallback()
    {
        cancelAnimationFrame(this._animationFrameHandle);
        clearTimeout(this._pollWarningTimeoutHandle);
    }

    /** @override */
    attributeChangedCallback(attribute, prev, value)
    {
        switch(attribute)
        {
            case 'for':
                let target;
                if (value)
                {
                    target = document.getElementById(value);
                }
                else
                {
                    target = document.querySelector('display-port') || document.querySelector('canvas');
                }

                if (this._inputTarget)
                {
                    this.detach();
                }

                if (target)
                {
                    this.attach(target);
                }
                break;
            // Event handlers...
            case 'onattach':
                this.onattach = new Function('event', `with(document){with(this){${value}}}`).bind(this);
                break;
            case 'ondetach':
                this.ondetach = new Function('event', `with(document){with(this){${value}}}`).bind(this);
                break;
            // NOTE: For debugging purposes...
            case 'id':
            case 'class':
                this._titleElement.innerHTML = `input-context${this.className ? '.' + this.className : ''}${this.hasAttribute('id') ? '#' + this.getAttribute('id') : ''}`;
                break;
        }
    }

    get src() { return this.getAttribute('src'); }
    set src(value) { this.setAttribute('src', value); }

    get for() { return this.getAttribute('for'); }
    set for(value) { this.setAttribute('for', value); }

    get strict() { return this.hasAttribute('strict'); }
    set strict(value) { if (value) this.setAttribute('strict', ''); else this.removeAttribute('strict'); }

    get auto() { return this.hasAttribute('auto'); }
    set auto(value) { if (value) this.setAttribute('auto', ''); else this.removeAttribute('auto'); }

    get onattach() { return this._onattach; }
    set onattach(value)
    {
        if (this._onattach) this.removeEventListener('attach', this._onattach);
        this._onattach = value;
        if (this._onattach) this.addEventListener('attach', value);
    }

    get ondetach() { return this._ondetach; }
    set ondetach(value)
    {
        if (this._ondetach) this.removeEventListener('detach', this._ondetach);
        this._ondetach = value;
        if (this._ondetach) this.addEventListener('detach', value);
    }

    attach(targetElement)
    {
        if (!targetElement)
        {
            throw new Error('Cannot attach input context to null.');
        }

        if (this._inputTarget)
        {
            if (this._inputTarget !== targetElement)
            {
                throw new Error('Input context already attached to another element.');
            }
            else
            {
                // It's already attached.
                return this;
            }
        }

        let target = targetElement;
        if (target)
        {
            if (target.canvas)
            {
                Keyboard.addInputEventListener(target, this.onInputEvent);
                Mouse.addInputEventListener(target.canvas, this.onInputEvent);
            }
            else
            {
                Keyboard.addInputEventListener(target, this.onInputEvent);
                Mouse.addInputEventListener(target, this.onInputEvent);
            }

            this.dispatchEvent(new CustomEvent('attach', {
                composed: true, bubbles: false, detail: { eventTarget: target, inputCallback: this.onInputEvent }
            }));
        }

        this._inputTarget = target;
        return this;
    }

    detach()
    {
        if (!this._inputTarget) return this;

        let target = this._inputTarget;
        this._inputTarget = null;

        if (target.canvas)
        {
            Keyboard.removeInputEventListener(target, this.onInputEvent);
            Mouse.removeInputEventListener(target.canvas, this.onInputEvent);
        }
        else
        {
            Keyboard.removeInputEventListener(target, this.onInputEvent);
            Mouse.removeInputEventListener(target, this.onInputEvent);
        }

        this.dispatchEvent(new CustomEvent('detach', {
            composed: true, bubbles: false, detail: { eventTarget: target, inputCallback: this.onInputEvent }
        }));

        return this;
    }

    poll()
    {
        this._lastPollTime = performance.now();

        // Update all inputs to the current key's values.
        for(let inputName in this._inputs)
        {
            let input = this._inputs[inputName];
            let inputType = input.inputType;
            switch(inputType)
            {
                case 'action':
                    // Action should be any key value.
                    let consumed = false;
                    for(let inputKey of this._inputKeys[inputName])
                    {
                        let value = inputKey.value;
                        if (value)
                        {
                            input.update(value, inputKey);
                            inputKey.consumeKey();
                            consumed = true;
                            break;
                        }
                    }
                    if (!consumed)
                    {
                        input.update(0, null);
                    }
                    break;
                case 'range':
                    // Range should be sum of keys.
                    let value = 0;
                    for(let inputKey of this._inputKeys[inputName])
                    {
                        value += inputKey.value;
                    }
                    input.update(value, null);
                    break;
                default:
                    throw new Error('Unknown input type.');
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

    onAnimationFrame(now)
    {
        this._animationFrameHandle = requestAnimationFrame(this.onAnimationFrame);

        // If enabled, do auto-polling
        if (this.auto) this.poll();

        // Update all inputs to the current key's values.
        for(let inputName in this._inputs)
        {
            let input = this._inputs[inputName];
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
            if (element.textContent != result)
            {
                element.textContent = result;
                let parent = element.parentNode;
                element.parentNode.removeChild(element);
                parent.appendChild(element);
            }
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
                if (typeof inputOption === 'string')
                {
                    inputOption = { key: inputOption, event: 'down' };
                }
                appendInputOption(inputContext, inputName, inputOption);
            }
        }
        else
        {
            parseInputOption(inputContext, inputName, inputOptions);
            if (typeof inputOptions === 'string')
            {
                inputOptions = { key: inputOptions, event: 'down' };
            }
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
