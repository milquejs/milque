import { InputSource } from './source/InputSource.js';

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

export class InputSourceElement extends HTMLElement
{
    static get [TEMPLATE_KEY]()
    {
        let template = document.createElement('template');
        template.innerHTML = `
        <div class="hidden">
            <label>
                <span>input-source</span><span id="title"></span>
            </label>
            <span>|</span>
            <p>
                <label for="poll">poll</label>
                <output id="poll"></output>
            </p>
            <p>
                <label for="focus">focus</label>
                <output id="focus"></output>
            </p>
        </div>`;
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
        .hidden {
            display: none;
        }
        div {
            font-family: monospace;
            color: #666;
            outline: 1px solid #666;
            padding: 4px;
        }
        p {
            display: inline;
            margin: 0;
            padding: 0;
        }
        #poll:empty:after, #focus:empty:after {
            content: "✗";
            color: #F00;
        }`;
        Object.defineProperty(this, STYLE_KEY, { value: style });
        return style;
    }

    /** @override */
    static get observedAttributes()
    {
        return [
            'for',
            'autopoll',
            // Event handlers
            'oninput',
            'onpoll',
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
        
        this._autopoll = false;

        this._oninput = null;
        this._onpoll = null;

        this._containerElement = this.shadowRoot.querySelector('div');
        this._titleElement = this.shadowRoot.querySelector('#title');
        this._pollElement = this.shadowRoot.querySelector('#poll');
        this._focusElement = this.shadowRoot.querySelector('#focus');

        this._pollCount = 0;
        this._pollCountDelay = 0;
        /** @type {HTMLElement} */
        this._sourceElement = null;
        /** @type {InputSource} */
        this._inputSource = null;
        this._animationFrameHandle = null;

        this.onSourceInput = this.onSourceInput.bind(this);
        this.onSourcePoll = this.onSourcePoll.bind(this);
        this.onSourceFocus = this.onSourceFocus.bind(this);
        this.onSourceBlur = this.onSourceBlur.bind(this);
        this.onAnimationFrame = this.onAnimationFrame.bind(this);
    }

    get source() { return this._inputSource; }
    poll() { this._inputSource.poll(); }
    
    /** @override */
    connectedCallback()
    {
        upgradeProperty(this, 'for');
        upgradeProperty(this, 'autopoll');
        upgradeProperty(this, 'oninput');
        upgradeProperty(this, 'onpoll');
        upgradeProperty(this, 'debug');

        // Allows this element to be focusable
        if (!this.hasAttribute('tabindex')) this.setAttribute('tabindex', 0);

        // Initialize input source, if unset
        if (!this.hasAttribute('for')) this._setSourceElement(this);
        
        // Start animation frame loop
        this._animationFrameHandle = requestAnimationFrame(this.onAnimationFrame);
    }

    /** @override */
    disconnectedCallback()
    {
        // Stop animation frame loop
        cancelAnimationFrame(this._animationFrameHandle);

        // Terminate input source
        this._setSourceElement(null);
    } 

    /** @override */
    attributeChangedCallback(attribute, prev, value)
    {
        switch(attribute)
        {
            case 'for':
                let eventTarget = value ? document.getElementById(value) : this;
                this._setSourceElement(eventTarget);
                break;
            case 'autopoll':
                this._autopoll = value !== null;
                break;
            // Event handlers
            case 'oninput':
                this.oninput = new Function('event', `with(document){with(this){${value}}}`).bind(this);
                break;
            case 'onpoll':
                this.onpoll = new Function('event', `with(document){with(this){${value}}}`).bind(this);
                break;
            // For debug info
            case 'id':
            case 'class':
                let cname = this.className ? '.' + this.className : '';
                let iname = this.hasAttribute('id') ? '#' + this.getAttribute('id') : '';
                this._titleElement.innerHTML = cname + iname;
                break;
            case 'debug':
                this._containerElement.classList.toggle('hidden', value);
                break;
        }
    }

    get for() { return this.getAttribute('for'); }
    set for(value) { this.setAttribute('for', value); }

    get autopoll() { return this.hasAttribute('autopoll'); }
    set autopoll(value)
    {
        if (value) this.setAttribute('autopoll', '');
        else this.removeAttribute('autopoll');
    }

    get debug() { return this.hasAttribute('debug'); }
    set debug(value)
    {
        if (value) this.setAttribute('debug', '');
        else this.removeAttribute('debug');
    }
    
    get oninput() { return this._oninput; }
    set oninput(value)
    {
        if (this._oninput) this.removeEventListener('input', this._oninput);
        this._oninput = value;
        if (this._oninput) this.addEventListener('input', value);
    }
    
    get onpoll() { return this._onpoll; }
    set onpoll(value)
    {
        if (this._onpoll) this.removeEventListener('poll', this._onpoll);
        this._onpoll = value;
        if (this._onpoll) this.addEventListener('poll', value);
    }

    onSourceInput(e)
    {
        this.dispatchEvent(new CustomEvent('input', {
            composed: true, bubbles: false, detail: e
        }));
    }

    onSourcePoll()
    {
        this._pollCount += 1;
        this.dispatchEvent(new CustomEvent('poll', {
            composed: true, bubbles: false
        }));
    }

    onSourceFocus()
    {
        this._focusElement.innerText = '✓';
    }

    onSourceBlur()
    {
        this._focusElement.innerText = '';
    }

    onAnimationFrame(now)
    {
        this._animationFrameHandle = requestAnimationFrame(this.onAnimationFrame);

        // If auto is enabled, do auto-polling
        if (this._autopoll) this.poll();

        // If debug is enabled, do poll-counting
        if (this.debug)
        {
            let dt = now - this._pollCountDelay;
            if (dt > 1000)
            {
                this._pollCountDelay = now;
                if (this._pollCount > 0)
                {
                    this._pollElement.innerText = '✓';
                    this._pollCount = 0;
                }
                else
                {
                    this._pollElement.innerText = '';
                }
            }
        }
    }

    _setSourceElement(eventTarget)
    {
        if (this._inputSource)
        {
            let inputSource = this._inputSource;
            let sourceElement = this._sourceElement;
            this._inputSource = null;
            this._sourceElement = null;
            sourceElement.removeEventListener('focus', this.onSourceFocus);
            sourceElement.removeEventListener('blur', this.onSourceBlur);
            inputSource.destroy();
        }

        if (eventTarget)
        {
            let inputSource = InputSource.from(eventTarget);
            inputSource.addEventListener('input', this.onSourceInput);
            inputSource.addEventListener('poll', this.onSourcePoll);
            eventTarget.addEventListener('focus', this.onSourceFocus);
            eventTarget.addEventListener('blur', this.onSourceBlur);
            this._sourceElement = eventTarget;
            this._inputSource = inputSource;
        }
    }
}
window.customElements.define('input-source', InputSourceElement);
