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

export class InputKeyElement extends HTMLElement
{
    static get [TEMPLATE_KEY]()
    {
        let template = document.createElement('template');
        template.innerHTML = `
        <kbd>
            <span id="key"><slot></slot></span>
            <span id="value" class="hidden"></span>
        </kbd>`;
        Object.defineProperty(this, TEMPLATE_KEY, { value: template });
        return template;
    }

    static get [STYLE_KEY]()
    {
        let style = document.createElement('style');
        style.innerHTML = `
        kbd {
            position: relative;
            display: inline-block;
            border-radius: 3px;
            border: 1px solid #888;
            font-size: 0.85em;
            font-weight: 700;
            text-rendering: optimizeLegibility;
            line-height: 12px;
            height: 14px;
            padding: 2px 4px;
            color: #444;
            background-color: #EEE;
            box-shadow: inset 0 -3px 0 #AAA;
            user-select: none;
            overflow: hidden;
        }
        
        kbd:empty:after {
            content: "<?>";
            opacity: 0.6;
        }
        
        .disabled {
            opacity: 0.6;
            box-shadow: none;
            background-color: #AAA;
        }

        .hidden {
            display: none;
        }
        
        #value {
            position: absolute;
            top: 0;
            bottom: 0;
            right: 0;
            font-size: 0.85em;
            padding: 0 4px;
            padding-top: 2px;
            color: #CCC;
            background-color: #333;
            box-shadow: inset 0 3px 0 #222;
        }`;
        Object.defineProperty(this, STYLE_KEY, { value: style });
        return style;
    }

    /** @override */
    static get observedAttributes()
    {
        return [
            'name',
            'value',
            'disabled',
        ];
    }

    constructor()
    {
        super();

        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(this.constructor[TEMPLATE_KEY].content.cloneNode(true));
        this.shadowRoot.appendChild(this.constructor[STYLE_KEY].cloneNode(true));

        this._keyboardElement = this.shadowRoot.querySelector('kbd');
        this._keyElement = this.shadowRoot.querySelector('#key');
        this._valueElement = this.shadowRoot.querySelector('#value');
    }

    /** @override */
    connectedCallback()
    {
        upgradeProperty(this, 'name');
        upgradeProperty(this, 'value');
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
                    this._valueElement.innerText = Number(value || 0).toFixed(1);
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

    get name() { return this.getAttribute('name'); }
    set name(value) { this.setAttribute('name', value); }

    get value() { return this.getAttribute('value'); }
    set value(value) { this.setAttribute('value', value); }

    get disabled() { return this.hasAttribute('disabled'); }
    set disabled(value)
    {
        if (value) this.setAttribute('disabled', '');
        else this.removeAttribute('disabled');
    }
}
window.customElements.define('input-kbd', InputKeyElement);
