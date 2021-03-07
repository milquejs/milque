import { properties, customEvents, attachShadowTemplate } from '@milque/cuttle.macro';

import INNER_HTML from './InputSource.template.html';
import INNER_STYLE from './InputSource.module.css';

import { InputSourceImpl } from './InputSourceImpl.js';

import { Keyboard } from '../device/Keyboard.js';
import { Mouse } from '../device/Mouse.js';

/**
 * @typedef {import('./InputSourceImpl.js').InputSourceImpl} InputSourceImpl
 */

/** This determines whether an element has an associated input event source. */
const INPUT_SOURCE_IMPL_KEY = Symbol('inputSourceImpl');

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
         * @type {InputSourceImpl}
         */
        this._sourceImpl = null;

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
        }
    }
    
    set autopoll(value)
    {
        if (hasInputSourceImpl(this._eventTarget))
        {
            updateInputSourceImplAutopoll(this._eventTarget, value);
        }
        else
        {
            this._autopoll = Boolean(value);
        }
    }

    get autopoll()
    {
        return this._autopoll;
    }

    /**
     * Poll input state from devices.
     * 
     * @param {number} now The current time in milliseconds.
     */
    poll(now)
    {
        this._sourceImpl.poll(now);
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

        let sourceImpl = obtainInputSourceImpl(eventTarget, this);
        this._sourceImpl = sourceImpl;
        this._eventTarget = eventTarget;

        updateInputSourceImplAutopoll(eventTarget, this.autopoll);
        
        sourceImpl.addEventListener('poll', this.onSourcePoll);
        sourceImpl.addEventListener('input', this.onSourceInput);
        eventTarget.addEventListener('focus', this.onTargetFocus);
        eventTarget.addEventListener('blur', this.onTargetBlur);
    }

    /** @private */
    clearEventTarget()
    {
        let eventTarget = this._eventTarget;
        let sourceImpl = this._sourceImpl;
        this._eventTarget = null;
        this._sourceImpl = null;

        if (eventTarget)
        {
            eventTarget.removeEventListener('focus', this.onTargetFocus);
            eventTarget.removeEventListener('blur', this.onTargetBlur);

            // Event source also exists (and therefore should be removed) if event target was setup.
            sourceImpl.removeEventListener('poll', this.onSourcePoll);
            sourceImpl.removeEventListener('input', this.onSourceInput);

            // Clean up event source if no longer used.
            releaseInputSourceImpl(eventTarget, this);
        }
    }
    
    /**
     * Register and enable the source input to listen to for the given device
     * and key code. Can be registered more than once to obtain active lease
     * on the input, which guarantees it will be unregistered the same number
     * of times before removal.
     * 
     * @param {string} deviceName The name of the device (case-sensitive).
     * @param {string} keyCode The key code for the given key in the device.
     */
    registerKey(deviceName, keyCode)
    {
        // An interface wrapper for InputSourceImpl
        this._sourceImpl.registerKey(deviceName, keyCode);
    }

    /**
     * Remove and disable the registered source for the given device and key code.
     * 
     * @param {string} deviceName The name of the device (case-sensitive).
     * @param {string} keyCode The key code for the given key in the device.
     */
    unregisterKey(deviceName, keyCode)
    {
        // An interface wrapper for InputSourceImpl
        this._sourceImpl.unregisterKey(deviceName, keyCode);
    }

    /**
     * Removes all registered inputs from all devices.
     */
    clearKeys()
    {
        // An interface wrapper for InputSourceImpl
        this._sourceImpl.clearKeys();
    }

    /**
     * @returns {Button|Axis}
     */
    getInputByKey(deviceName, keyCode)
    {
        // An interface wrapper for InputSourceImpl
        return this._sourceImpl.getInputByKey(deviceName, keyCode);
    }

    /**
     * Check whether an input is registered for the given device and key code.
     * 
     * @param {string} deviceName The name of the device.
     * @param {string} keyCode The key code in the device.
     * @returns {boolean} Whether the device and key code has been registered.
     */
    hasInputByKey(deviceName, keyCode)
    {
        // An interface wrapper for InputSourceImpl
        return this._sourceImpl.hasInputByKey(deviceName, keyCode);
    }

    /** A map of device names to devices. */
    get devices()
    {
        // An interface wrapper for InputSourceImpl
        return this._sourceImpl.devices;
    }
}
window.customElements.define('input-source', InputSource);

/**
 * @param {EventTarget} eventTarget The target element to listen to.
 * @returns {boolean} Whether the event target has an associated input source.
 */
function hasInputSourceImpl(eventTarget)
{
    return eventTarget
        && Object.prototype.hasOwnProperty.call(eventTarget, INPUT_SOURCE_IMPL_KEY)
        && Object.getOwnPropertyDescriptor(eventTarget, INPUT_SOURCE_IMPL_KEY).value;
}

/**
 * @param {EventTarget} eventTarget The target element.
 * @returns {InputSourceImpl} The attached input source state.
 */
function getInputSourceState(eventTarget)
{
    return Object.getOwnPropertyDescriptor(eventTarget, INPUT_SOURCE_IMPL_KEY).value.impl;
}

/**
 * @param {EventTarget} eventTarget The target element.
 * @returns {Array<InputSource>} A list of input sources holding leases to the source impl.
 */
function getInputSourceRefs(eventTarget)
{
    return Object.getOwnPropertyDescriptor(eventTarget, INPUT_SOURCE_IMPL_KEY).value.refs;
}

/**
 * @param {EventTarget} eventTarget The target element to listen to.
 * @param {InputSource} inputSource The input source to be associated with the event target element.
 */
function obtainInputSourceImpl(eventTarget, inputSource)
{
    if (!hasInputSourceImpl(eventTarget))
    {
        let impl = new InputSourceImpl([
            new Keyboard(eventTarget),
            new Mouse(eventTarget),
        ]);
        Object.defineProperty(eventTarget, INPUT_SOURCE_IMPL_KEY, {
            value: {
                impl: impl,
                refs: [
                    inputSource,
                ]
            },
            configurable: true,
        });
        return impl;
    }
    else
    {
        return getInputSourceState(eventTarget);
    }
}

/**
 * @param {EventTarget} eventTarget The target element listening to.
 * @param {InputSource} inputSource The input source to be removed from the event target element.
 */
function releaseInputSourceImpl(eventTarget, inputSource)
{
    if (hasInputSourceImpl(eventTarget))
    {
        let { impl, refs } = Object.getOwnPropertyDescriptor(eventTarget, INPUT_SOURCE_IMPL_KEY).value;
        let index = refs.indexOf(inputSource);
        if (index >= 0)
        {
            refs.splice(index, 1);
        }

        if (refs.length <= 0)
        {
            Object.defineProperty(eventTarget, INPUT_SOURCE_IMPL_KEY, {
                value: null,
                configurable: true,
            });
            impl.destroy();
        }
    }
}

function updateInputSourceImplAutopoll(eventTarget, autopoll)
{
    let state = getInputSourceState(eventTarget);
    if (autopoll)
    {
        state.autopoll = true;
    }
    else
    {
        let autopoll = false;
        for(let inputSource of getInputSourceRefs(eventTarget))
        {
            autopoll |= inputSource.autopoll;
        }
        state.autopoll = autopoll;
    }
}
