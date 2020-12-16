import { properties, customEvents, attachShadowTemplate } from '@milque/cuttle.macro';

import { InputSource } from '../source/InputSource.js';
import INNER_HTML from './InputSourceElement.template.html';
import INNER_STYLE from './InputSourceElement.module.css';

export class InputSourceElement extends HTMLElement
{
    static get [properties]()
    {
        return {
            for: String,
            autopoll: Boolean,
            debug: Boolean,
        };
    }

    static get [customEvents]()
    {
        return [
            'input',
            'poll',
        ];
    }

    /** @override */
    static get observedAttributes()
    {
        return [
            // Listening for built-in attribs
            'id',
            'class',
        ];
    }

    constructor()
    {
        super();
        attachShadowTemplate(this, INNER_HTML, INNER_STYLE, { mode: 'open' });
        
        this._autopoll = false;

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
        this._clearSourceElement();
    } 

    /** @override */
    attributeChangedCallback(attribute, prev, value)
    {
        switch(attribute)
        {
            case 'for':
                this._setSourceElement(value ? document.getElementById(value) : this);
                break;
            // For debug info
            case 'id':
            case 'class':
                {
                    let cname = this.className ? '.' + this.className : '';
                    let iname = this.hasAttribute('id') ? '#' + this.getAttribute('id') : '';
                    this._titleElement.innerHTML = cname + iname;
                }
                break;
            case 'debug':
                this._containerElement.classList.toggle('hidden', value);
                break;
        }
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

    _clearSourceElement()
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
    }

    _setSourceElement(eventTarget)
    {
        this._clearSourceElement();

        if (!eventTarget)
        {
            throw new Error('Event target not found.');
        }

        let inputSource = InputSource.for(eventTarget);
        inputSource.addEventListener('input', this.onSourceInput);
        inputSource.addEventListener('poll', this.onSourcePoll);
        eventTarget.addEventListener('focus', this.onSourceFocus);
        eventTarget.addEventListener('blur', this.onSourceBlur);
        this._sourceElement = eventTarget;
        this._inputSource = inputSource;
    }
}
window.customElements.define('input-source', InputSourceElement);
