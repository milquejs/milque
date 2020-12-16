import { attachShadowTemplate, properties } from '@milque/cuttle.macro';

import INNER_HTML from './InputKeyElement.template.html';
import INNER_STYLE from './InputKeyElement.module.css';

export class InputKeyElement extends HTMLElement
{
    static get [properties]()
    {
        return {
            name: String,
            value: String,
            disabled: Boolean,
        };
    }

    constructor()
    {
        super();
        attachShadowTemplate(this, INNER_HTML, INNER_STYLE, { mode: 'open' });

        this._keyboardElement = this.shadowRoot.querySelector('kbd');
        this._keyElement = this.shadowRoot.querySelector('#key');
        this._valueElement = this.shadowRoot.querySelector('#value');
    }

    /** @override */
    attributeChangedCallback(attribute, prev, value)
    {
        switch(attribute)
        {
            case 'name':
                this._keyElement.innerText = value;
                break;
            case 'value':
                if (value !== null)
                {
                    this._valueElement.classList.toggle('hidden', false);
                    this._valueElement.innerText = value;
                    this._keyboardElement.style.paddingRight = `${this._valueElement.clientWidth + 4}px`;
                }
                else
                {
                    this._valueElement.classList.toggle('hidden', true);
                }
                break;
            case 'disabled':
                this._keyboardElement.classList.toggle('disabled', value !== null);
                break;
        }
    }
}
window.customElements.define('input-key', InputKeyElement);
