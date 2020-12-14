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
        template.innerHTML = ``;
        Object.defineProperty(this, TEMPLATE_KEY, { value: template });
        return template;
    }

    static get [STYLE_KEY]()
    {
        let style = document.createElement('style');
        style.innerHTML = ``;
        Object.defineProperty(this, STYLE_KEY, { value: style });
        return style;
    }

    /** @override */
    static get observedAttributes()
    {
        return [
            'source',
            'map',
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
                let src = JSON.stringify(value);
                this._src = src
                this._setInputMap(value);
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
}
window.customElements.define('input-ctx', InputContextElement);
