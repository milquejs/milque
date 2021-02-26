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

    constructor(inputContext = new InputContext())
    {
        super();
        attachShadowTemplate(this, INNER_HTML, INNER_STYLE, { mode: 'open' });

        this._inputContext = inputContext;

        this._mapElement = this.shadowRoot.querySelector('input-map');
        this._sourceElement = this.shadowRoot.querySelector('input-source');

        this.onInputMapLoad = this.onInputMapLoad.bind(this);
        this.onInputSourcePoll = this.onInputSourcePoll.bind(this);

        this._mapElement.addEventListener('load', this.onInputMapLoad);
        this._sourceElement.addEventListener('poll', this.onInputSourcePoll);
    }

    get context() { return this._inputContext; }
    get source() { return this._sourceElement.source; }
    get map() { return this._mapElement.map; }

    onInputMapLoad()
    {
        let source = this._sourceElement.source;
        let map = this._mapElement.map;
        if (source && map)
        {
            this._inputContext
                .setInputMap(map)
                .setInputSource(source)
                .attach();
            this._inputContext.disabled = this._disabled;
        }
    }

    onInputSourcePoll()
    {
        for(let [inputName, entries] of Object.entries(this._mapElement.mapElements))
        {
            let value = this._inputContext.getInputValue(inputName);
            let primary = entries[0];
            let outputElement = primary.querySelector('output');
            outputElement.innerText = Number(value).toFixed(2);
        }
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
            case 'for':
                {
                    this._sourceElement.for = value;

                    let source = this._sourceElement.source;
                    let map = this._mapElement.map;
                    if (map)
                    {
                        this._inputContext
                            .setInputMap(map)
                            .setInputSource(source)
                            .attach();
                        this._inputContext.disabled = this._disabled;
                    }
                }
                break;
            case 'src':
                this._mapElement.src = value;
                break;
            case 'disabled':
                {
                    let source = this._sourceElement.source;
                    let map = this._mapElement.map;
                    if (source && map)
                    {
                        this._inputContext.disabled = this._disabled;
                    }
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
