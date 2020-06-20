const INNER_HTML = `
<div>
    <p><slot>Input</slot></p>
    <button id="main">
        <kbd>---</kbd>
    </button>
</div>`;
const INNER_STYLE = `
:host {
    display: inline-block;
}
div {
    display: flex;
    align-items: center;
}
div > * {
    margin: 0;
    padding: 3px 6px;
}
button {
    background: transparent;
    border: none;
}
button:hover {
    background: rgba(0, 0, 0, 0.1);
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
`;

const TEMPLATE_KEY = Symbol('template');
const STYLE_KEY = Symbol('style');

export class InputMapping extends HTMLElement
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
            'name',
            'key',
            'scale',
            'event'
        ];
    }

    constructor()
    {
        super();

        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(this.constructor[TEMPLATE_KEY].content.cloneNode(true));
        this.shadowRoot.appendChild(this.constructor[STYLE_KEY].cloneNode(true));

        this.mainButton = this.shadowRoot.querySelector('#main');
        this.mainKey = this.shadowRoot.querySelector('#main > kbd');

        this.onMainClick = this.onMainClick.bind(this);
    }

    /** @override */
    connectedCallback()
    {
        this.mainButton.addEventListener('click', this.onMainClick);
    }

    /** @override */
    disconnectedCallback()
    {
        this.mainButton.removeEventListener('click', this.onMainClick);
    }

    /** @override */
    attributeChangedCallback(attribute, old, value)
    {
        switch(attribute)
        {
            case 'name':
                break;
            case 'key':
                this.mainKey.textContent = value;
                break;
        }
    }

    onMainClick()
    {
        
    }

    get type() { return this.hasAttribute('event') ? 'action' : 'range'; }

    get name() { return this.getAttribute('name'); }
    set name(value) { this.setAttribute('name', value); }

    get key() { return this.getAttribute('key'); }
    set key(value) { this.setAttribute('key', value); }

    get scale() { return Number(this.getAttribute('scale')); }
    set scale(value) { this.setAttribute('scale', value); }

    get event() { return this.getAttribute('event'); }
    set event(value) { this.setAttribute('event', value); }
}
window.customElements.define('input-mapping', InputMapping);
