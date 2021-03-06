import { properties, customEvents, attachShadowTemplate } from '@milque/cuttle.macro';

import INNER_HTML from './InputSource.template.html';
import INNER_STYLE from './InputSource.module.css';

import { InputEventSource } from './InputEventSource.js';

import { stringifyDeviceKeyCodePair } from '../adapter/Synthetic.js';
import { Keyboard } from '../device/Keyboard.js';
import { Mouse } from '../device/Mouse.js';

/** This holds the ref count for each key source per input event source. */
const KEY_SOURCE_REF_COUNT_KEY = Symbol('keySourceRefCount');

function initKeySourceRefs(eventSource)
{
    if (!(KEY_SOURCE_REF_COUNT_KEY in eventSource))
    {
        eventSource[KEY_SOURCE_REF_COUNT_KEY] = {};
    }
}

function addKeySourceRef(eventSource, deviceName, keyCode)
{
    const keyString = stringifyDeviceKeyCodePair(deviceName, keyCode);
    let refCounts = eventSource[KEY_SOURCE_REF_COUNT_KEY];
    let value = (refCounts[keyString] + 1) || 1;
    refCounts[keyString] = value;
    return value;
}

function removeKeySourceRef(eventSource, deviceName, keyCode)
{
    const keyString = stringifyDeviceKeyCodePair(deviceName, keyCode);
    let refCounts = eventSource[KEY_SOURCE_REF_COUNT_KEY];
    let value = (refCounts[keyString] - 1) || 0;
    refCounts[keyString] = Math.max(value, 0);
    return value;
}

function clearKeySourceRefs(eventSource)
{
    eventSource[KEY_SOURCE_REF_COUNT_KEY] = {};
}

/** This determines whether an element has an associated input event source. */
const INPUT_EVENT_SOURCE_KEY = Symbol('inputEventSource');

/**
 * @param {EventTarget} eventTarget The target element to listen to.
 * @returns {boolean} Whether the event target has an associated input source.
 */
export function hasInputEventSource(eventTarget)
{
    return Object.prototype.hasOwnProperty.call(eventTarget, INPUT_EVENT_SOURCE_KEY) && Object.getOwnPropertyDescriptor(eventTarget, INPUT_EVENT_SOURCE_KEY).value;
}

/**
 * @param {EventTarget} eventTarget The target element to listen to.
 * @returns {InputEventSource} The active input event source for the target element.
 */
export function getInputEventSource(eventTarget)
{
    return Object.getOwnPropertyDescriptor(eventTarget, INPUT_EVENT_SOURCE_KEY).value;
}

/**
 * @param {EventTarget} eventTarget The target element to listen to.
 * @param {InputSource} inputSource The input source to be associated with the event target element.
 */
export function setInputEventSource(eventTarget, inputEventSource)
{
    Object.defineProperty(eventTarget, INPUT_EVENT_SOURCE_KEY, {
        value: inputEventSource,
        configurable: true,
    });
}

/**
 * @param {EventTarget} eventTarget The target element listened to.
 */
export function deleteInputEventSource(eventTarget)
{
    Object.defineProperty(eventTarget, INPUT_EVENT_SOURCE_KEY, {
        value: null,
        configurable: true,
    });
}

export class InputSource extends HTMLElement
{
    /**
     * Get the associated input source for the given event target.
     * 
     * @param {EventTarget} eventTarget The target element to listen
     * for all input events.
     * @returns {InputSource} The input source for the given event target.
     */
    static for(eventTarget)
    {
        return new InputSource(eventTarget);
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

    static get [properties]()
    {
        return {
            for: String,
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

    /**
     * @param {EventTarget} [eventTarget] The event target to listen for all input events.
     */
    constructor(eventTarget = undefined)
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

        /** @private */
        this._pollCount = 0;
        /** @private */
        this._pollCountDelay = 0;

        /**
         * @private
         * @type {EventTarget}
         */
        this._eventTarget = null;
        /**
         * @private
         * @type {InputEventSource}
         */
        this._eventSource = null;
        this._keySourceRefCount = {};

        /** @private */
        this.onSourcePoll = this.onSourcePoll.bind(this);
        /** @private */
        this.onSourceInput = this.onSourceInput.bind(this);
        /** @private */
        this.onTargetFocus = this.onTargetFocus.bind(this);
        /** @private */
        this.onTargetBlur = this.onTargetBlur.bind(this);

        if (eventTarget)
        {
            this.setEventTarget(eventTarget);
        }
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
    }

    /** @override */
    disconnectedCallback()
    {
        this.clearEventTarget();
    }

    /** @override */
    attributeChangedCallback(attribute, prev, value)
    {
        switch(attribute)
        {
            case 'for':
                this.setEventTarget(value ? document.getElementById(value) : this);
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
        }
    }

    /**
     * Poll input state from devices.
     * 
     * @param {number} now The current time in milliseconds.
     */
    poll(now)
    {
        this._eventSource.poll(now);
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
        this._pollCount += 1;
        this.dispatchEvent(new CustomEvent('poll', {
            composed: true, bubbles: false
        }));

        let dt = now - this._pollCountDelay;
        if (dt > 1000)
        {
            this._pollCountDelay = now;
            if (this._pollCount > 0)
            {
                this._pollElement.innerHTML = '✓';
                this._pollCount = 0;
            }
            else
            {
                this._pollElement.innerHTML = '';
            }
        }
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

    /** @private */
    setEventTarget(eventTarget)
    {
        this.clearEventTarget();

        if (!eventTarget)
        {
            throw new Error('Cannot set null as event target for input source.');
        }

        let eventSource;
        if (!hasInputEventSource(eventTarget))
        {
            eventSource = new InputEventSource([
                new Keyboard(eventTarget),
                new Mouse(eventTarget),
            ]);
            setInputEventSource(eventTarget, eventSource);
            initKeySourceRefs(eventSource);
        }
        else
        {
            eventSource = getInputEventSource(eventTarget);
        }
        this._eventSource = eventSource;
        this._eventTarget = eventTarget;

        // TODO: Need to revisit whether this is a good way to set autopoll.
        // NOTE: Auto-poll can only be turned on and only during init.
        let autopoll = this.autopoll;
        if (autopoll)
        {
            this._eventSource.autopoll = autopoll;
        }
        
        eventSource.addEventListener('poll', this.onSourcePoll);
        eventSource.addEventListener('input', this.onSourceInput);
        eventTarget.addEventListener('focus', this.onTargetFocus);
        eventTarget.addEventListener('blur', this.onTargetBlur);
    }

    /** @private */
    clearEventTarget()
    {
        let eventTarget = this._eventTarget;
        let eventSource = this._eventSource;
        this._eventTarget = null;
        this._eventSource = null;

        if (eventTarget)
        {
            eventTarget.removeEventListener('focus', this.onTargetFocus);
            eventTarget.removeEventListener('blur', this.onTargetBlur);

            // Event source should also exist if event target was setup.
            eventSource.removeEventListener('poll', this.onSourcePoll);
            eventSource.removeEventListener('input', this.onSourceInput);

            // Clean up event source if no longer used.
            if (eventSource.countEventListeners('input') <= 0)
            {
                eventSource.destroy();
                deleteInputEventSource(eventTarget);
            }
        }
    }

    enableKeySource(deviceName, keyCode)
    {
        if (!deviceName || !keyCode)
        {
            throw new Error('Invalid device name or key code for key source.');
        }
        let eventSource = this._eventSource;
        let refCount = addKeySourceRef(eventSource, deviceName, keyCode);
        if (refCount === 1)
        {
            eventSource.addKeySource(deviceName, keyCode);
        }
    }

    disableKeySource(deviceName, keyCode)
    {
        if (!deviceName || !keyCode)
        {
            throw new Error('Invalid device name or key code for key source.');
        }
        let eventSource = this._eventSource;
        let refCount = removeKeySourceRef(eventSource, deviceName, keyCode);
        if (refCount === 0)
        {
            eventSource.deleteKeySource(deviceName, keyCode);
        }
    }

    getKeySource(deviceName, keyCode)
    {
        if (!deviceName || !keyCode)
        {
            throw new Error('Invalid device name or key code for key source.');
        }
        return this._eventSource.getKeySource(deviceName, keyCode);
    }

    hasKeySource(deviceName, keyCode)
    {
        if (!deviceName || !keyCode)
        {
            throw new Error('Invalid device name or key code for key source.');
        }
        return this._eventSource.hasKeySource(deviceName, keyCode);
    }

    clearKeySources()
    {
        let eventSource = this._eventSource;
        eventSource.clearKeySources();
        clearKeySourceRefs(eventSource);
    }

    get keySources() { return this._eventSource.keySources; }
    get devices() { return this._eventSource.devices; }
}
window.customElements.define('input-source', InputSource);
