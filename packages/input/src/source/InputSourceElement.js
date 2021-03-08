import { properties, customEvents, attachShadowTemplate } from '@milque/cuttle.macro';

import INNER_HTML from './InputSourceElement.template.html';
import INNER_STYLE from './InputSourceElement.module.css';

import { InputSource } from './InputSource.js';

/**
 * @typedef {import('./InputSourceState.js').InputSourceState} InputSourceState
 */

/** Poll status check interval in milliseconds. */
const INTERVAL_DURATION = 1000;

export class InputSourceElement extends HTMLElement
{
    static get [properties]()
    {
        return {
            for: String,
            /**
             * Whether to automatically poll the state on each frame. This is a shared
             * state with all input sources that have the same event target. In other
             * words, all input sources with the same event target must have the
             * same autopoll value, otherwise behavior is undefined.
             * 
             * Implementation-wise, the closest and most recent autopoll value is used.
             * This follows the standard HTML loading order.
             */
            autopoll: Boolean,
        };
    }

    static get [customEvents]()
    {
        return [
            'input',
            'poll',
        ];
    }

    constructor()
    {
        super();
        attachShadowTemplate(this, INNER_HTML, INNER_STYLE, { mode: 'open' });

        /** @private */
        this._containerElement = this.shadowRoot.querySelector('div');
        /** @private */
        this._titleElement = this.shadowRoot.querySelector('#title');
        /** @private */
        this._pollElement = this.shadowRoot.querySelector('#poll');
        /** @private */
        this._focusElement = this.shadowRoot.querySelector('#focus');

        /**
         * @private
         * @type {EventTarget}
         */
        this._eventTarget = null;
        /**
         * @private
         * @type {InputSource}
         */
        this._sourceState = null;

        /** @private */
        this.onSourcePoll = this.onSourcePoll.bind(this);
        /** @private */
        this.onSourceInput = this.onSourceInput.bind(this);
        /** @private */
        this.onTargetFocus = this.onTargetFocus.bind(this);
        /** @private */
        this.onTargetBlur = this.onTargetBlur.bind(this);
        /** @private */
        this.onPollStatusCheck = this.onPollStatusCheck.bind(this);

        /** @private */
        this._intervalHandle = 0;
    }

    get eventTarget()
    {
        return this._eventTarget;
    }

    get source()
    {
        return this._sourceState;
    }
    
    /** @override */
    connectedCallback()
    {
        // Allows this element to be focusable
        if (!this.hasAttribute('tabindex')) this.setAttribute('tabindex', 0);

        // Initialize input source event target as self, if unset
        if (!this.hasAttribute('for') && !this._eventTarget)
        {
            this.setEventTarget(this);
        }

        this._intervalHandle = setInterval(this.onPollStatusCheck, INTERVAL_DURATION);
    }

    /** @override */
    disconnectedCallback()
    {
        this.clearEventTarget();
        clearInterval(this._intervalHandle);
    }

    /** @override */
    attributeChangedCallback(attribute, prev, value)
    {
        switch(attribute)
        {
            case 'for':
                {
                    let target;
                    let name;
                    if (value)
                    {
                        target = document.getElementById(value);
                        name = `${target.tagName.toLowerCase()}#${value}`;
                    }
                    else
                    {
                        target = this;
                        name = 'input-source';
                    }
                    this.setEventTarget(value ? document.getElementById(value) : this);
                    // For debug info
                    this._titleElement.innerHTML = `for(${name})`;
                }
                break;
            case 'autopoll':
                {
                    if (this._sourceState)
                    {
                        this._sourceState.autopoll = this._autopoll;
                    }
                }
                break;
        }
    }
    
    /**
     * Set event target to listen for input events.
     * 
     * @param {EventTarget} [eventTarget] The event target to listen for input events. If
     * falsey, no target will be listened to.
     */
    setEventTarget(eventTarget = undefined)
    {
        this.clearEventTarget();

        if (eventTarget)
        {
            let sourceState = InputSource.for(eventTarget);
            this._sourceState = sourceState;
            this._eventTarget = eventTarget;
    
            sourceState.autopoll = this.autopoll;
            
            sourceState.addEventListener('poll', this.onSourcePoll);
            sourceState.addEventListener('input', this.onSourceInput);
            eventTarget.addEventListener('focus', this.onTargetFocus);
            eventTarget.addEventListener('blur', this.onTargetBlur);
        }

        return this;
    }

    /**
     * Stop listening to the current target for input events.
     */
    clearEventTarget()
    {
        if (this._eventTarget)
        {
            let eventTarget = this._eventTarget;
            let sourceState = this._sourceState;
            this._eventTarget = null;
            this._sourceState = null;
    
            if (eventTarget)
            {
                eventTarget.removeEventListener('focus', this.onTargetFocus);
                eventTarget.removeEventListener('blur', this.onTargetBlur);
    
                // Event source also exists (and therefore should be removed) if event target was setup.
                sourceState.removeEventListener('poll', this.onSourcePoll);
                sourceState.removeEventListener('input', this.onSourceInput);
    
                // Clean up event source if no longer used.
                InputSource.delete(eventTarget);
            }
        }
    }

    /**
     * Poll input state from devices.
     * 
     * @param {number} now The current time in milliseconds.
     */
    poll(now)
    {
        this._sourceState.poll(now);
    }

    /** @private */
    onPollStatusCheck()
    {
        if (this._sourceState && this._sourceState.polling)
        {
            this._pollElement.innerHTML = '✓';
        }
        else
        {
            this._pollElement.innerHTML = '';
        }
    }

    /** @private */
    onSourceInput({ stage, deviceName, keyCode, input })
    {
        this.dispatchEvent(new CustomEvent('input', {
            composed: true, bubbles: false,
            detail: {
                stage,
                deviceName,
                keyCode,
                input,
            }
        }));
    }

    /** @private */
    onSourcePoll({ now })
    {
        this.dispatchEvent(new CustomEvent('poll', {
            composed: true, bubbles: false, detail: { now }
        }));
    }

    /** @private */
    onTargetFocus()
    {
        this._focusElement.innerHTML = '✓';
    }

    /** @private */
    onTargetBlur()
    {
        this._focusElement.innerHTML = '';
    }
}
window.customElements.define('input-source', InputSourceElement);
