import { InputKey } from 'milque';
import { InputContext } from './InputContext.js';
import { InputSourceElement } from './InputSourceElement.js';
import { InputKeyElement } from './InputKeyElement.js';

const TEMPLATE_KEY = Symbol('template');
const STYLE_KEY = Symbol('style');
function upgradeProperty(element, propertyName)
{
    if (element.hasOwnProperty(propertyName))
    {
        let value = element[propertyName];
        delete element[propertyName];
        element[propertyName] = value;
    }
}

export class InputContextElement extends HTMLElement
{
    static get [TEMPLATE_KEY]()
    {
        let template = document.createElement('template');
        template.innerHTML = `
        <table>
            <thead>
                <tr class="header">
                    <th id="title" colspan=3>input-context</th>
                    <th id="source">&nbsp;</th>
                </tr>
                <tr class="hint">
                    <th>name</th>
                    <th>key</th>
                    <th>mod</th>
                    <th>value</th>
                </tr>
            </thead>
            <tbody>
            </tbody>
        </table>
        <slot></slot>`;
        Object.defineProperty(this, TEMPLATE_KEY, { value: template });
        return template;
    }

    static get [STYLE_KEY]()
    {
        let style = document.createElement('style');
        style.innerHTML = `
        :host {
            display: inline-block;
        }
        table {
            border-collapse: collapse;
        }
        table, th, td {
            border: 1px solid gray;
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
        slot {
            display: none;
        }`;
        Object.defineProperty(this, STYLE_KEY, { value: style });
        return style;
    }

    /** @override */
    static get observedAttributes()
    {
        return [
            'for',
            'src',
            'disabled',
            // For debugging purposes
            'debug',
            // Listening for built-in attribs
            'id',
            'class',
        ];
    }

    constructor()
    {
        super();

        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(this.constructor[TEMPLATE_KEY].content.cloneNode(true));
        this.shadowRoot.appendChild(this.constructor[STYLE_KEY].cloneNode(true));

        this._src = '';

        this._titleElement = this.shadowRoot.querySelector('#title');
        this._pollElement = this.shadowRoot.querySelector('#poll');

        this._tableBody = this.shadowRoot.querySelector('tbody');
        this._children = this.shadowRoot.querySelector('slot');

        this._inputContext = new InputContext();
    }
    
    /** @override */
    connectedCallback()
    {
        upgradeProperty(this, 'src');
        upgradeProperty(this, 'for');
        upgradeProperty(this, 'disabled');
        upgradeProperty(this, 'debug');

        // Allows this element to be focusable
        if (!this.hasAttribute('tabindex')) this.setAttribute('tabindex', 0);
    }

    /** @override */
    disconnectedCallback()
    {
        this._inputContext.disabled = true;
    }

    /** @override */
    attributeChangedCallback(attribute, prev, value)
    {
        switch(attribute)
        {
            case 'for':
                let element = value ? document.getElementById(value) : document.querySelector('input-source');
                if (element)
                {
                    this._inputContext.attach(element.source);
                }
                else
                {
                    this._inputContext.detach();
                }
                break;
            case 'src':
                if (this._src !== value)
                {
                    this._src = value;
                    if (value.trim().startsWith('{'))
                    {
                        let jsonData = JSON.parse(value);
                        this._inputContext.setInputMap(jsonData);
                    }
                    else
                    {
                        fetch(value)
                            .then(fileBlob => fileBlob.json())
                            .then(jsonData => this._inputContext.setInputMap(jsonData));
                    }
                }
                break;
            case 'disabled':
                this._inputContext.disabled = value !== null;
                break;
            // NOTE: For debug info
            case 'id':
            case 'class':
                this._titleElement.innerHTML = `input-port${this.className ? '.' + this.className : ''}${this.hasAttribute('id') ? '#' + this.getAttribute('id') : ''}`;
                break;
            case 'debug':
                break;
        }
    }

    get src() { return this.getAttribute('src'); }
    set src(value)
    {
        switch(typeof value)
        {
            case 'object':
                let src = JSON.stringify(value);
                this._src = src
                this._inputContext.setInputMap(value);
                this.setAttribute('src', src);
                break;
            case 'string':
                this.setAttribute('src', value);
                break;
            default:
                this.setAttribute('src', String(value));
                break;
        }
    }
    
    get disabled() { return this.hasAttribute('disabled'); }
    set disabled(value)
    {
        if (value) this.setAttribute('disabled', '');
        else this.removeAttribute('disabled');
    }
}
window.customElements.define('input-port', InputContextElement);
