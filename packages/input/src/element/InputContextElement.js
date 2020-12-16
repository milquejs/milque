import { attachShadowTemplate, properties } from '@milque/cuttle.macro';

import { InputContext } from '../InputContext.js';
import INNER_HTML from './InputContextElement.template.html';
import INNER_STYLE from './InputContextElement.module.css';

function upgradeProperty(element, propertyName)
{
    if (Object.prototype.hasOwnProperty.call(element, propertyName))
    {
        let value = element[propertyName];
        delete element[propertyName];
        element[propertyName] = value;
    }
}

export class InputContextElement extends HTMLElement
{
    static get [properties]()
    {
        return {
            for: String,
            disabled: Boolean,
            autopoll: Boolean,
            debug: Boolean,
        };
    }

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

        this._inputContext = new InputContext();

        this._mapElement = this.shadowRoot.querySelector('input-map');
        this._sourceElement = this.shadowRoot.querySelector('input-source');
    }

    get context() { return this._inputContext; }
    get source() { return this._sourceElement.source; }
    get map() { return this._mapElement.map; }
    
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
            case 'for':
                {
                    this._sourceElement.for = value;
                    this._inputContext.attach(this._sourceElement.source);
                }
                break;
            case 'disabled':
                this._inputContext.disabled = value !== null;
                break;
            case 'autopoll':
                this._sourceElement.autopoll = value !== null;
                break;
            case 'src':
                {
                    this._mapElement.src = value;
                    this._inputContext.setInputMap(this._mapElement.map);
                }
                break;
            case 'debug':
                this._mapElement.classList.toggle('hidden', value === null);
                break;
            // For debug info
            case 'id':
                this._sourceElement.id = value;
                break;
            case 'class':
                this._sourceElement.className = value;
                break;
        }
    }

    get src() { return this._mapElement.src; }
    set src(value) { this._mapElement.src = value; }
}
window.customElements.define('input-context', InputContextElement);
