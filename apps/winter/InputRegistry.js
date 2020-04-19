import { Keyboard, Mouse } from '../../packages/input/src/index.js';

const TEMPLATE_KEY = Symbol('template');

export class InputRegistry extends HTMLElement
{
    static get [TEMPLATE_KEY]()
    {
        const INNER_HTML = `
        <slot>
        </slot>`;
        const INNER_STYLE = ``;

        let template = document.createElement('template');
        template.innerHTML = `<div>${INNER_HTML}<style>${INNER_STYLE}</style></div>`;
        Object.defineProperty(this, TEMPLATE_KEY, { value: template });
        return template;
    }

    constructor()
    {
        super();

        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(this.constructor[TEMPLATE_KEY].content.cloneNode(true));

        this.onSlotChange = this.onSlotChange.bind(this);
        this.onHandleInputEvent = this.onHandleInputEvent.bind(this);

        let slot = this.shadowRoot.querySelector('slot');
        slot.addEventListener('slotchange', this.onSlotChange);

        this.assignedContexts = {};

        this.deviceSource = null;
        this.devices = {
            keyboard: new Keyboard(),
            mouse: new Mouse(),
        };

        this.devices.keyboard.addEventHandler(this.onHandleInputEvent);
        this.devices.mouse.addEventHandler(this.onHandleInputEvent);
    }

    /** @override */
    connectedCallback()
    {
        this.deviceSource = this.closest('display-port') || document.documentElement;
        this.devices.keyboard.setEventTarget(this.deviceSource);
        this.devices.mouse.setEventTarget(this.deviceSource);
    }

    /** @override */
    disconnectedCallback()
    {
        this.deviceSource = null;
        this.devices.keyboard.setEventTarget(this.deviceSource);
        this.devices.mouse.setEventTarget(this.deviceSource);
    }

    onSlotChange(e)
    {
        let nodes = e.target.assignedNodes();
        for(let node of nodes)
        {
            if (node instanceof InputContext)
            {
                const contextName = node.getAttribute('name');
                this.assignedContexts[contextName] = node;
            }
        }
    }

    onHandleInputEvent(source, key, event, value)
    {
        for(let context of Object.values(this.assignedContexts))
        {
            let result = context.handleInputEvent(source, key, event, value);
            if (result) return true;
        }
    }

    poll()
    {
        for(let context of Object.values(this.assignedContexts))
        {
            if (context.hasAttribute('disabled')) continue;
            context.poll();
        }
    }

    getContextualInputState(contextName)
    {
        return this.assignedContexts[contextName].getInputState();
    }

    get priority() { return this.getAttribute('priority'); }
    set priority(value) { this.setAttribute('priority', value); }
}
InputRegistry.adapters = {
    map: {},
    define(name, constructor)
    {
        this.map[name] = constructor;
    },
    get(name)
    {
        return this.map[name];
    }
};
window.customElements.define('input-registry', InputRegistry);

/************************************************** InputContext ****************************************************/

export class InputContext extends HTMLElement
{
    static get [TEMPLATE_KEY]()
    {
        const INNER_HTML = `
        <ul>
            <slot></slot>
        </ul>`;
        const INNER_STYLE = `
        ul {
            padding: 0;
            list-style: none;
        }`;

        let template = document.createElement('template');
        template.innerHTML = `<div>${INNER_HTML}<style>${INNER_STYLE}</style></div>`;
        Object.defineProperty(this, TEMPLATE_KEY, { value: template });
        return template;
    }

    constructor()
    {
        super();

        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(this.constructor[TEMPLATE_KEY].content.cloneNode(true));

        this.onSlotChange = this.onSlotChange.bind(this);

        let slot = this.shadowRoot.querySelector('slot');
        slot.addEventListener('slotchange', this.onSlotChange);

        this.inputState = {
            values: {},
            internals: {},
        };
        this.assignedInputs = {};
    }

    onSlotChange(e)
    {
        this.assignedInputs = {};

        let nodes = e.target.assignedNodes();
        for(let node of nodes)
        {
            if (node instanceof InputMapping)
            {
                const inputName = node.getAttribute('name');
                const adapterName = node.adapter;
                const inputParams = node.params;

                this.assignedInputs[inputName] = node;
                this.inputState.values[inputName] = 0;
                this.inputState.internals[inputName] = {
                    prev: 0,
                    value: 0,
                    next: 0,
                    params: inputParams,
                };

                let adapter = InputRegistry.adapters.get(adapterName);
                if (!adapter) throw new Error(`Unknown adapter '${adapterName}'.`);
            }
        }
    }

    handleInputEvent(source, key, event, value)
    {
        let inputEvent = [ source, key, event ];
        let result = false;
        for(let inputName of Object.keys(this.assignedInputs))
        {
            let input = this.assignedInputs[inputName];
            let adapterName = input.adapter;
            let adapter = InputRegistry.adapters.get(adapterName);

            let internal = this.inputState.internals[inputName];
            result |= adapter.update(internal, inputEvent, value);
        }
        return result;
    }

    poll()
    {
        for(let inputName of Object.keys(this.assignedInputs))
        {
            let input = this.assignedInputs[inputName];
            let adapterName = input.adapter;
            let adapter = InputRegistry.adapters.get(adapterName);
            let inputInternal = this.inputState.internals[inputName];
            adapter.poll(inputInternal);
            this.inputState.values[inputName] = inputInternal.value;
        }
    }

    getInputState()
    {
        return this.inputState.values;
    }
}
window.customElements.define('input-context', InputContext);

/************************************************** InputMapping ****************************************************/

export class InputMapping extends HTMLElement
{
    static get [TEMPLATE_KEY]()
    {
        const INNER_HTML = `
        <li>
            <label class="input">null</label>
            <label class="action"><slot></slot></label>
            <label class="adapter">---</label>
            <label class="params">---</label>
        </li>`;
        const INNER_STYLE = `
        li {
            display: flex;
            padding: 0.2rem;
            border-bottom: 1px solid black;
        }

        li > *:not(:first-child) {
            border-left: 1px solid black;
        }

        li:hover {
            background-color: rgba(0, 0, 0, 0.3);
        }

        li > * {
            flex: 1;
            padding: 0 0.5rem;
            overflow-x: auto;
        }`;

        let template = document.createElement('template');
        template.innerHTML = `<div>${INNER_HTML}<style>${INNER_STYLE}</style></div>`;
        Object.defineProperty(this, TEMPLATE_KEY, { value: template });
        return template;
    }

    constructor()
    {
        super();

        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(this.constructor[TEMPLATE_KEY].content.cloneNode(true));

        this._input = this.shadowRoot.querySelector('.input');
        this._adapter = this.shadowRoot.querySelector('.adapter');
        this._params = this.shadowRoot.querySelector('.params');
    }

    /** @override */
    connectedCallback()
    {
        this._input.textContent = this.name;
        this._adapter.textContent = this.adapter;
        this._params.textContent = this.getAttribute('params') || '---';
    }

    get name() { return this.getAttribute('name') || 'null'; }
    get adapter() { return this.getAttribute('adapter') || 'action'; }
    get params()
    {
        let result = {};
        let params = (this.getAttribute('params') || '').trim().split(/[\s\,]+/);
        for(let param of params)
        {
            if (!param) continue;

            let i = param.indexOf(':');
            let key = param.substring(0, i);
            let value = param.substring(i + 1);
            result[key] = parseParamValue(value);
        }
        return result;
    }
}
window.customElements.define('input-mapping', InputMapping);

function parseParamValue(paramValue)
{
    let i = paramValue.indexOf('_');
    let j = paramValue.indexOf('.');
    let source = paramValue.substring(0, i);
    let key = paramValue.substring(i + 1, j);
    let event = paramValue.substring(j + 1);
    return [ source, key, event ];
}

/************************************************** ADAPTERS ****************************************************/

export class InputAdapter
{
    static get parameters() { return []; }

    /** @override */
    static update(input, inputEvent, value) { return false; }
    /** @override */
    static consume(input) { return input.next; }
    /** @override */
    static poll(input)
    {
        input.prev = input.value;
        input.value = input.next;
        input.next = this.consume(input);
        return input;
    }
}

export class StateInputAdapter extends InputAdapter
{
    /** @override */
    static get parameters() { return [ 'down', 'up' ]; }

    /** @override */
    static update(input, inputEvent, value)
    {
        if (compareParams(input.params.down, inputEvent))
        {
            input.next = 1;
            return true;
        }
        else if (compareParams(input.params.up, inputEvent))
        {
            input.next = 0;
            return true;
        }
        return false;
    }
}
InputRegistry.adapters.define('state', StateInputAdapter);

export class ActionInputAdapter extends InputAdapter
{
    /** @override */
    static get parameters() { return [ 'event' ]; }

    /** @override */
    consume(input) { return 0; }

    /** @override */
    update(input, inputEvent, value)
    {
        if (compareParams(input.params.event, inputEvent))
        {
            input.next = 1;
            return true;
        }
        return false;
    }
}
InputRegistry.adapters.define('action', ActionInputAdapter);

function compareParams(inputEvent, otherInputEvent)
{
    if (!inputEvent || !otherInputEvent) return false;
    let [ source, key, event ] = inputEvent;
    let [ otherSource, otherKey, otherEvent ] = otherInputEvent;

    // Test the most dynamic values first to exit early on average.
    if (event || otherEvent)
    {
        if (event !== otherEvent) return false;
    }
    if (key || otherKey)
    {
        if (key !== otherKey) return false;
    }
    if (source || otherSource)
    {
        if (source !== otherSource) return false;
    }
    return true;
}
