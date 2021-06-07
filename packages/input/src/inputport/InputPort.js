import INNER_HTML from './InputPort.template.html';
import INNER_STYLE from './InputPort.module.css';

import { KeyboardDevice } from '../device/KeyboardDevice.js';
import { MouseDevice } from '../device/MouseDevice.js';
import { Button } from '../axisbutton/Button.js';
import { Axis } from '../axisbutton/Axis.js';
import { AutoPoller } from '../AutoPoller.js';
import { InputBindings } from '../InputBindings.js';
import { DeviceInputAdapter } from '../DeviceInputAdapter.js';

import { InputCode } from '../inputcode/InputCode.js';

/**
 * @typedef {import('../device/InputDevice.js').InputDevice} InputDevice
 * @typedef {import('../device/InputDevice.js').InputDeviceEvent} InputDeviceEvent
 * @typedef {import('../axisbutton/InputBase.js').InputBase} InputBase
 * @typedef {import('../InputBindings.js').DeviceName} DeviceName
 * @typedef {import('../InputBindings.js').KeyCode} KeyCode
 * @typedef {import('../InputBindings.js').BindingOptions} BindingOptions
 * 
 * @typedef {string} InputName
 */

export class InputPort extends HTMLElement
{
    /** @protected */
    static get [Symbol.for('templateNode')]()
    {
        let t = document.createElement('template');
        t.innerHTML = INNER_HTML;
        Object.defineProperty(this, Symbol.for('templateNode'), { value: t });
        return t;
    }

    /** @protected */
    static get [Symbol.for('styleNode')]()
    {
        let t = document.createElement('style');
        t.innerHTML = INNER_STYLE;
        Object.defineProperty(this, Symbol.for('styleNode'), { value: t });
        return t;
    }

    static define(customElements = window.customElements)
    {
        customElements.define('input-port', this);
    }

    /** @override */
    static get observedAttributes()
    {
        return [
            'autopoll',
            'for',
        ];
    }

    /** @returns {boolean} */
    get autopoll()
    {
        return this._autopoll;
    }

    set autopoll(value)
    {
        this.toggleAttribute('autopoll', value);
    }

    /** @returns {string} */
    get for()
    {
        return this._for;
    }

    set for(value)
    {
        this.setAttribute('for', value);
    }

    constructor()
    {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(this.constructor[Symbol.for('templateNode')].content.cloneNode(true));
        this.shadowRoot.appendChild(this.constructor[Symbol.for('styleNode')].cloneNode(true));

        /** @private */
        this._titleElement = this.shadowRoot.querySelector('#title');
        /** @private */
        this._pollElement = this.shadowRoot.querySelector('#poll');
        /** @private */
        this._focusElement = this.shadowRoot.querySelector('#focus');
        /** @private */
        this._bodyElement = this.shadowRoot.querySelector('tbody');
        /** @private */
        this._outputElements = {};

        /** @private */
        this.onAnimationFrame = this.onAnimationFrame.bind(this);
        /** @private */
        this.animationFrameHandle = null;

        const eventTarget = this;
        /** @private */
        this._for = '';
        /** @private */
        this._eventTarget = eventTarget;
        /** @private */
        this._autopoll = false;

        /**
         * @private
         * @type {Record<string, Axis|Button>}
         */
        this.inputs = {};
        /**
         * @private
         * @type {Array<InputDevice>}
         */
        this.devices = [
            new MouseDevice('Mouse', eventTarget),
            new KeyboardDevice('Keyboard', eventTarget),
        ];

        /** @private */
        this.bindings = new InputBindings();
        /** @private */
        this.adapter = new DeviceInputAdapter(this.bindings);
        /** @private */
        this.autopoller = new AutoPoller(this.adapter);
        
        /** @private */
        this.anyButton = new Button(1);
        /** @private */
        this.anyButtonDevice = '';
        /** @private */
        this.anyButtonCode = '';
        /** @private */
        this.anyAxis = new Axis(1);
        /** @private */
        this.anyAxisDevice = '';
        /** @private */
        this.anyAxisCode = '';

        /** @private */
        this.onInput = this.onInput.bind(this);
        /** @private */
        this.onEventTargetFocus = this.onEventTargetFocus.bind(this);
        /** @private */
        this.onEventTargetBlur = this.onEventTargetBlur.bind(this);
    }
    
    /** @override */
    connectedCallback()
    {
        if (Object.prototype.hasOwnProperty.call(this, 'for'))
        {
            let value = this.for;
            delete this.for;
            this.for = value;
        }

        if (Object.prototype.hasOwnProperty.call(this, 'autopoll'))
        {
            let value = this.autopoll;
            delete this.autopoll;
            this.autopoll = value;
        }

        let eventTarget = this._eventTarget;
        eventTarget.addEventListener('focus', this.onEventTargetFocus);
        eventTarget.addEventListener('blur', this.onEventTargetBlur);
        for(let device of this.devices)
        {
            device.setEventTarget(eventTarget);
            device.addEventListener('input', this.onInput);
        }
        if (this._autopoll)
        {
            this.autopoller.start();
        }

        // Make sure the table and values are up to date
        this.updateTable();
        this.updateTableValues();
        this.animationFrameHandle = requestAnimationFrame(this.onAnimationFrame);
    }

    /** @override */
    disconnectedCallback()
    {
        if (this.autopoller.running)
        {
            this.autopoller.stop();
        }
        for(let device of this.devices)
        {
            device.removeEventListener('input', this.onInput);
            device.destroy();
        }
        let eventTarget = this._eventTarget;
        eventTarget.removeEventListener('focus', this.onEventTargetFocus);
        eventTarget.removeEventListener('blur', this.onEventTargetBlur);
    }

    /** @override */
    attributeChangedCallback(attribute, prev, value)
    {
        switch (attribute)
        {
            case 'for':
                {
                    this._for = value;
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
                        name = 'input-port';
                    }
                    this.updateEventTarget(target);
                    // For debug info
                    this._titleElement.innerHTML = `for ${name}`;
                }
                break;
            case 'autopoll':
                this._autopoll = value !== null;
                if (this._autopoll)
                {
                    this.autopoller.start();
                }
                else
                {
                    this.autopoller.stop();
                }
                break;
        }
    }

    /** @private */
    onAnimationFrame()
    {
        this.animationFrameHandle = requestAnimationFrame(this.onAnimationFrame);
        this.updateTableValues();
        this.updatePollStatus();
    }

    /**
     * @private
     * @param {InputDeviceEvent} e
     */
    onInput(e)
    {
        let result = this.adapter.onInput(e);
        switch(e.event)
        {
            case 'pressed':
                this.anyButtonDevice = e.device;
                this.anyButtonCode = e.code;
                this.anyButton.onUpdate(0, 1, 1);
                break;
            case 'released':
                this.anyButtonDevice = e.device;
                this.anyButtonCode = e.code;
                this.anyButton.onUpdate(0, 0, -1);
                break;
            case 'move':
            case 'wheel':
                this.anyAxisDevice = e.device;
                this.anyAxisCode = e.code;
                this.anyAxis.onUpdate(0, e.value, e.movement);
                break;
        }
        return result;
    }

    /**
     * @private
     * @param {number} now
     */
    onPoll(now)
    {
        this.adapter.onPoll(now);
        this.anyButton.onPoll(now);
        this.anyAxis.onPoll(now);
    }

    /** @private */
    onBind()
    {
        this.updateTable();
    }

    /** @private */
    onUnbind()
    {
        this.updateTable();
    }

    /** @private */
    onEventTargetFocus()
    {
        this._focusElement.innerHTML = '✓';
    }

    /** @private */
    onEventTargetBlur()
    {
        this._focusElement.innerHTML = '';
        // Clear all input states.
        for(let input of this.bindings.getInputs())
        {
            input.onStatus(0, 0);
        }
        this.anyButton.onStatus(0, 0);
        this.anyAxis.onStatus(0, 0);
    }

    /**
     * @param {number} now 
     */
    poll(now = performance.now())
    {
        if (this.autopoller.running)
        {
            throw new Error('Should not manually poll() while autopolling.');
        }
        this.onPoll(now);
    }

    /**
     * @param {InputName} name 
     * @param {DeviceName} device 
     * @param {KeyCode} code 
     * @param {BindingOptions} [opts] 
     */
    bindButton(name, device, code, opts = undefined)
    {
        let input;
        if (this.hasButton(name))
        {
            input = this.getButton(name);
        }
        else
        {
            input = new Button(1);
            this.inputs[name] = input;
        }
        this.bindings.bind(input, device, code, opts);
        this.onBind();
    }

    /**
     * @param {string} name 
     * @param {DeviceName} device 
     * @param {KeyCode} code 
     * @param {BindingOptions} [opts] 
     */
    bindAxis(name, device, code, opts = undefined)
    {
        let input;
        if (this.hasAxis(name))
        {
            input = this.getAxis(name);
        }
        else
        {
            input = new Axis(1);
            this.inputs[name] = input;
        }
        this.bindings.bind(input, device, code, opts);
        this.onBind();
    }

    /**
     * @param {string} name 
     * @param {DeviceName} device 
     * @param {KeyCode} negativeCode 
     * @param {KeyCode} positiveCode 
     */
    bindAxisButtons(name, device, negativeCode, positiveCode)
    {
        let input;
        if (this.hasAxis(name))
        {
            input = this.getAxis(name);
        }
        else
        {
            input = new Axis(2);
            this.inputs[name] = input;
        }
        this.bindings.bind(input, device, positiveCode);
        this.bindings.bind(input, device, negativeCode, { inverted: true });
        this.onBind();
    }

    /**
     * @param {string} name 
     */
    unbindButton(name)
    {
        if (this.hasButton(name))
        {
            let input = this.getButton(name);
            delete this.inputs[name];
            this.bindings.unbind(input);
            this.onUnbind();
        }
    }

    /**
     * @param {string} name 
     */
    unbindAxis(name)
    {
        if (this.hasAxis(name))
        {
            let input = this.getAxis(name);
            delete this.inputs[name];
            this.bindings.unbind(input);
            this.onUnbind();
        }
    }

    /**
     * Get the input for the given name. Assumes the input already exists for the name.
     * @param {InputName} name 
     * @returns {InputBase}
     */
    getInput(name)
    {
        return this.inputs[name];
    }

    /**
     * Get the button for the given name. Assumes a button already exists for the name.
     * @param {InputName} name
     * @returns {Button}
     */
    getButton(name)
    {
        return this.inputs[name];
    }

    /**
     * Get the axis for the given name. Assumes an axis already exists for the name.
     * @param {InputName} name
     * @returns {Axis}
     */
    getAxis(name)
    {
        return this.inputs[name];
    }

    /**
     * Whether a button exists for the name and that it is of type {@link Button}.
     * @returns {boolean}
     */
    hasButton(name)
    {
        return name in this.inputs && this.inputs[name] instanceof Button;
    }

    /**
     * Whether an axis exists for the name and that it is of type {@link Axis}.
     * @returns {boolean}
     */
    hasAxis(name)
    {
        return name in this.inputs && this.inputs[name] instanceof Axis;
    }

    /**
     * Get whether a button for the given name is down. Assumes a button already exists for the name.
     * @param {InputName} name
     * @returns {boolean}
     */
    isButtonDown(name)
    {
        return this.inputs[name].down;
    }

    /**
     * Get whether a button for the given name is pressed. Assumes a button already exists for the name.
     * @param {InputName} name
     * @returns {boolean}
     */
    isButtonPressed(name)
    {
        return this.inputs[name].pressed;
    }

    /**
     * Get whether a button for the given name is released. Assumes a button already exists for the name.
     * @param {InputName} name
     * @returns {boolean}
     */
    isButtonReleased(name)
    {
        return this.inputs[name].released;
    }

    /**
     * @param {InputName} name
     * @returns {number}
     */
    getInputValue(name)
    {
        return this.inputs[name].value;
    }

    /**
     * @param {InputName} name
     * @returns {number}
     */
    getButtonValue(name)
    {
        return this.buttons[name].value;
    }

    /**
     * @param {InputName} name
     * @returns {number}
     */
    getAxisValue(name)
    {
        return this.inputs[name].value;
    }

    /**
     * @param {InputName} name
     * @returns {number}
     */
    getAxisDelta(name)
    {
        return this.inputs[name].delta;
    }

    /** @returns {boolean} */
    isAnyButtonDown(include = undefined)
    {
        if (typeof include === 'undefined')
        {
            return this.anyButton.down;
        }
        else
        {
            let buttons = this.inputs;
            for(let name of include)
            {
                let button = buttons[name];
                if (button.down)
                {
                    return true;
                }
            }
        }
        return false;
    }

    /** @returns {boolean} */
    isAnyButtonPressed(include = undefined)
    {
        if (typeof include === 'undefined')
        {
            return this.anyButton.pressed;
        }
        else
        {
            let buttons = this.inputs;
            for(let name of include)
            {
                let button = buttons[name];
                if (button.pressed)
                {
                    return true;
                }
            }
        }
        return false;
    }

    /** @returns {boolean} */
    isAnyButtonReleased(include = undefined)
    {
        if (typeof include === 'undefined')
        {
            return this.anyButton.released;
        }
        else
        {
            let buttons = this.inputs;
            for(let name of include)
            {
                let button = buttons[name];
                if (button.released)
                {
                    return true;
                }
            }
        }
        return false;
    }

    /** @returns {number} */
    getAnyAxisValue(include = undefined)
    {
        if (typeof include === 'undefined')
        {
            return this.anyAxis.value;
        }
        else
        {
            let axes = this.inputs;
            for(let name of include)
            {
                let axis = axes[name];
                if (axis.value)
                {
                    return axis.value;
                }
            }
        }
        return 0;
    }

    /** @returns {number} */
    getAnyAxisDelta(include = undefined)
    {
        if (typeof include === 'undefined')
        {
            return this.anyAxis.delta;
        }
        else
        {
            let axes = this.inputs;
            for(let name of include)
            {
                let axis = axes[name];
                if (axis.delta)
                {
                    return axis.delta;
                }
            }
        }
        return 0;
    }

    getLastButtonDevice()
    {
        return this.anyButtonDevice;
    }

    getLastButtonCode()
    {
        return this.anyButtonCode;
    }

    getLastAxisDevice()
    {
        return this.anyAxisDevice;
    }

    getLastAxisCode()
    {
        return this.anyAxisCode;
    }

    /** @returns {MouseDevice} */
    getMouse()
    {
        return this.devices[0];
    }

    /** @returns {KeyboardDevice} */
    getKeyboard()
    {
        return this.devices[1];
    }

    /** @private */
    updateTable()
    {
        if (!this.isConnected)
        {
            // Don't update the DOM if not connected to any :(
            return;
        }
        let primaryElements = {};
        let entries = [];
        for(let name of Object.keys(this.inputs))
        {
            let input = this.inputs[name];
            let bindings = this.bindings.getBindingsByInput(input);
            let primary = true;
            for(let binding of bindings)
            {
                let element = createInputTableEntry(
                    `${input.constructor.name}.${name}`,
                    `${binding.device}.${binding.code}`,
                    0,
                    primary);
                entries.push(element);
                if (primary)
                {
                    primaryElements[name] = element.querySelector('output');
                    primary = false;
                }
            }
        }
        this._outputElements = primaryElements;
        this._bodyElement.innerHTML = '';
        for (let entry of entries)
        {
            this._bodyElement.appendChild(entry);
        }
    }

    /** @private */
    updateTableValues()
    {
        if (!this.isConnected)
        {
            // Don't update the DOM if not connected to any :(
            return;
        }
        for(let name of Object.keys(this._outputElements))
        {
            let element = this._outputElements[name];
            let value = this.inputs[name].value;
            element.innerText = Number(value).toFixed(2);
        }
    }

    /** @private */
    updatePollStatus()
    {
        for(let input of Object.values(this.inputs))
        {
            if (!input.polling)
            {
                this._pollElement.innerHTML = '';
                return;
            }
        }
        this._pollElement.innerHTML = '✓';
    }

    /** @private */
    updateEventTarget(eventTarget)
    {
        let prevTarget = this._eventTarget;
        this._eventTarget = eventTarget;
        if (prevTarget)
        {
            prevTarget.removeEventListener('focus', this.onEventTargetFocus);
            prevTarget.removeEventListener('blur', this.onEventTargetBlur);
        }
        for(let device of this.devices)
        {
            device.setEventTarget(eventTarget);
        }
        if (eventTarget)
        {
            eventTarget.addEventListener('focus', this.onEventTargetFocus);
            eventTarget.addEventListener('blur', this.onEventTargetBlur);
        }
    }
}
InputPort.define();

function createInputTableEntry(name, key, value, primary = true)
{
    let row = document.createElement('tr');
    if (primary)
    {
        row.classList.add('primary');
    }
    // Name
    {
        let data = document.createElement('td');
        data.textContent = name;
        data.classList.add('name');
        row.appendChild(data);
    }
    // Value
    {
        let data = document.createElement('td');
        let output = document.createElement('output');
        if (primary)
        {
            output.innerText = Number(value).toFixed(2);
        }
        else
        {
            output.innerText = '---';
        }
        output.classList.add('value');
        data.appendChild(output);
        row.appendChild(data);
    }
    // Key
    {
        let data = document.createElement('td');
        data.classList.add('key');
        let kbd = new InputCode();
        kbd.innerText = key;
        data.appendChild(kbd);
        row.appendChild(data);
    }
    return row;
}
