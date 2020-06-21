const INNER_HTML = `
<kbd></kbd>`;
const INNER_STYLE = `
:host {
    display: inline-block;
}
kbd {
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
    static toInputMap(nodes)
    {
        let inputMap = {};
        
        for(let node of nodes)
        {
            if (node instanceof InputMapping)
            {
                let inputName = node.name;
    
                let keys;
                if (inputName in inputMap)
                {
                    keys = inputMap[inputName];
                }
                else
                {
                    inputMap[inputName] = keys = [];
                }
    
                let inputType = node.type;
                switch(inputType)
                {
                    case 'action':
                        keys.push({
                            key: node.key,
                            event: node.event,
                        });
                        break;
                    case 'range':
                        keys.push({
                            key: node.key,
                            scale: node.scale,
                        });
                        break;
                    default:
                        throw new Error('Unknown input type.');
                }
            }
        }

        return inputMap;
    }

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

        this.keyElement = this.shadowRoot.querySelector('kbd');
    }

    /** @override */
    attributeChangedCallback(attribute, prev, value)
    {
        switch(attribute)
        {
            case 'name':
                break;
            case 'key':
                this.keyElement.textContent = value;
                break;
        }
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
