import { attachShadowTemplate, properties } from '@milque/cuttle.macro';

import INNER_HTML from './InputPort.template.html';
import INNER_STYLE from './InputPort.module.css';

import { InputContext } from '../context/InputContext.js';
import { InputSourceElement } from '../source/InputSourceElement.js';

import '../source/InputSourceElement.js';
import './InputMapElement.js';

function upgradeProperty(element, propertyName)
{
    if (Object.prototype.hasOwnProperty.call(element, propertyName))
    {
        let value = element[propertyName];
        delete element[propertyName];
        element[propertyName] = value;
    }
}

export class InputPort extends HTMLElement
{
    static get [properties]()
    {
        // src: A custom type,
        return {
            for: String,
            autopoll: Boolean,
            disabled: Boolean,
        };
    }

    /** @override */
    static get observedAttributes()
    {
        return [
            'src'
        ];
    }

    constructor(inputContext = new InputContext())
    {
        super();
        attachShadowTemplate(this, INNER_HTML, INNER_STYLE, { mode: 'open' });

        /** @private */
        this._src = '';

        /** @private */
        this._mapElement = this.shadowRoot.querySelector('input-map');
        /** @private */
        this._sourceElement = this.shadowRoot.querySelector('input-source');

        /** @private */
        this._context = inputContext;

        /** @private */
        this.onSourcePoll = this.onSourcePoll.bind(this);
        /** @private */
        this.onSourceChange = this.onSourceChange.bind(this);
        /** @private */
        this.onContextChange = this.onContextChange.bind(this);

        this._sourceElement.addEventListener('poll', this.onSourcePoll);
        this._sourceElement.addEventListener('change', this.onSourceChange);
        this._context.addEventListener('change', this.onContextChange);
    }

    get context() { return this._context; }
    get source() { return this._sourceElement.source; }
    get mapping() { return this._mapElement.map; }

    get src() { return this._src; }
    set src(value) { this.setAttribute('src', typeof value === 'string' ? value : JSON.stringify(value)); }

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
                }
                break;
            case 'src':
                if (this._src !== value)
                {
                    this._src = value;
                    if (value.trim().startsWith('{'))
                    {
                        let jsonData = JSON.parse(value);
                        this.updateMapping(jsonData);
                    }
                    else
                    {
                        fetch(value)
                            .then(fileBlob => fileBlob.json())
                            .then(jsonData => this.updateMapping(jsonData));
                    }
                }
                break;
            case 'autopoll':
                this._sourceElement.autopoll = this._autopoll;
                break;
            case 'disabled':
                if (this._context.source)
                {
                    this._context.disabled = this._disabled;
                }
                break;
        }
    }

    /** @private */
    updateMapping(inputMapping)
    {
        this._context.setInputMapping(inputMapping);
        this._mapElement.src = inputMapping;
    }

    /** @private */
    onSourcePoll()
    {
        for(let [inputName, entries] of Object.entries(this._mapElement.mapElements))
        {
            let value = this._context.getInputState(inputName);
            let primary = entries[0];
            let outputElement = primary.querySelector('output');
            outputElement.innerText = Number(value).toFixed(2);
        }
    }

    /** @private */
    onSourceChange()
    {
        if (this._context.source) this._context.detach();
        if (this._sourceElement.source)
        {
            this._context.attach(this._sourceElement.source);
            this._context.disabled = this._disabled;
        }
    }

    /** @private */
    onContextChange()
    {
        this._mapElement.src = this._context.mapping;
    }

    hasInput(inputName)
    {
        return this._context.hasInput(inputName);
    }

    getInput(inputName)
    {
        return this._context.getInput(inputName);
    }

    getInputState(inputName)
    {
        return this._context.getInputState(inputName);
    }

    getInputChanged(inputName)
    {
        return this._context.getInputChanged(inputName);
    }
}
window.customElements.define('input-port', InputPort);
