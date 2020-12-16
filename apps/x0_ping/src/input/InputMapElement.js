import { attachShadowTemplate } from '@milque/cuttle.macro';

import { InputKeyElement } from './InputKeyElement.js';
import INNER_HTML from './InputMapElement.template.html';
import INNER_STYLE from './InputMapElement.module.css';

function upgradeProperty(element, propertyName)
{
    if (Object.prototype.hasOwnProperty.call(element, propertyName))
    {
        let value = element[propertyName];
        delete element[propertyName];
        element[propertyName] = value;
    }
}

export class InputMapElement extends HTMLElement
{
    /** @override */
    static get observedAttributes()
    {
        return [
            'src',
            // Listening for built-in attribs
            'id',
            'class',
        ];
    }

    constructor()
    {
        super();
        attachShadowTemplate(this, INNER_HTML, INNER_STYLE, { mode: 'open' });

        this._src = '';

        this._titleElement = this.shadowRoot.querySelector('#title');
        this._tableElements = {};
        this._bodyElement = this.shadowRoot.querySelector('tbody');

        this._children = this.shadowRoot.querySelector('slot');
    }
    
    /** @override */
    connectedCallback()
    {
        upgradeProperty(this, 'src');
    }

    /** @override */
    attributeChangedCallback(attribute, prev, value)
    {
        switch(attribute)
        {
            case 'src':
                if (this._src !== value)
                {
                    this._src = value;
                    if (value.trim().startsWith('{'))
                    {
                        let jsonData = JSON.parse(value);
                        this._setInputMap(jsonData);
                    }
                    else
                    {
                        fetch(value)
                            .then(fileBlob => fileBlob.json())
                            .then(jsonData => this._setInputMap(jsonData));
                    }
                }
                break;
            // For debug info
            case 'id':
            case 'class':
                this._titleElement.innerHTML = `input-port${this.className ? '.' + this.className : ''}${this.hasAttribute('id') ? '#' + this.getAttribute('id') : ''}`;
                break;
        }
    }

    get src() { return this.getAttribute('src'); }
    set src(value)
    {
        switch(typeof value)
        {
            case 'object':
                {
                    let src = JSON.stringify(value);
                    this._src = src;
                    this._setInputMap(value);
                    this.setAttribute('src', src);
                }
                break;
            case 'string':
                this.setAttribute('src', value);
                break;
            default:
                this.setAttribute('src', String(value));
                break;
        }
    }

    _setInputMap(inputMap)
    {
        let entries = [];
        for(let name in inputMap)
        {
            let input = inputMap[name];
            inputToTableEntries(entries, name, input);
        }
        this._bodyElement.innerHTML = '';
        for(let entry of entries)
        {
            this._bodyElement.appendChild(entry);
        }
    }
}
window.customElements.define('input-map', InputMapElement);

function inputToTableEntries(out, name, input)
{
    if (Array.isArray(input))
    {
        inputToTableEntries(out, name, input[0]);
        let length = input.length;
        for(let i = 1; i < length; ++i)
        {
            out.push(parseInputOption(name, input[i], false));
        }
    }
    else
    {
        out.push(parseInputOption(name, input, true));
    }
    return out;
}

function parseInputOption(inputName, inputOption, inputPrimary = true)
{
    if (typeof inputOption === 'object')
    {
        const { key, event, scale } = inputOption;
        return createInputTableEntry(inputName, key, event, scale, 0, inputPrimary);
    }
    else
    {
        return createInputTableEntry(inputName, inputOption, null, 1, 0, inputPrimary);
    }
}

function createInputTableEntry(name, key, event, scale, value, primary = true)
{
    let row = document.createElement('tr');
    if (primary) row.classList.add('primary');
    // Name
    {
        let data = document.createElement('td');
        data.textContent = name;
        data.classList.add('name');
        row.appendChild(data);
    }
    // Key
    {
        let data = document.createElement('td');
        data.classList.add('key');
        let kbd = new InputKeyElement();
        kbd.innerText = key;
        data.appendChild(kbd);
        row.appendChild(data);
    }
    // Modifiers
    {
        let data = document.createElement('td');
        let samp = document.createElement('samp');
        let modifiers = [];
        if (typeof event === 'string' && event !== 'null')
        {
            modifiers.push(event);
        }
        if (typeof scale === 'number' && scale !== 1)
        {
            modifiers.push(`\u00D7${scale.toFixed(2)}`);
        }
        samp.innerText = modifiers.join(' ');
        data.classList.add('mod');
        data.appendChild(samp);
        row.appendChild(data);
    }
    // Value
    {
        let data = document.createElement('td');
        let output = document.createElement('output');
        output.innerText = Number(value).toFixed(2);
        output.classList.add('value');
        data.appendChild(output);
        row.appendChild(data);
    }
    return row;
}
