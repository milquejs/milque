import { AutoPoller } from './AutoPoller.js';
import { Axis } from './axisbutton/Axis.js';
import { Button } from './axisbutton/Button.js';
import { KeyboardDevice } from './device/KeyboardDevice.js';
import { MouseDevice } from './device/MouseDevice.js';
import { DeviceInputAdapter } from './DeviceInputAdapter.js';
import { InputBindings } from './InputBindings.js';

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

/**
 * @typedef {'bind'|'unbind'|'focus'|'blur'} InputContextEventType
 * @typedef {(e: InputContextEvent) => boolean} InputContextEventListener
 * @typedef InputContextEvent
 * @property {InputContextEventType} type
 */

export class InputContext
{
    /**
     * @param {EventTarget} eventTarget 
     * @param {object} [opts]
     */
    constructor(eventTarget, opts = {})
    {
        /**
         * @type {Record<string, Axis|Button>}
         */
        this.inputs = {};
        /**
         * @type {Array<InputDevice>}
         */
        this.devices = [
            new MouseDevice('Mouse', eventTarget),
            new KeyboardDevice('Keyboard', eventTarget),
        ];
        this.bindings = new InputBindings();
        this.adapter = new DeviceInputAdapter(this.bindings);
        this.autopoller = new AutoPoller(this.adapter);

        /** @protected */
        this.eventTarget = eventTarget;
        /** @protected */
        this.anyButton = new Button(1);
        /** @protected */
        this.anyButtonDevice = '';
        /** @protected */
        this.anyButtonCode = '';
        /** @protected */
        this.anyAxis = new Axis(1);
        /** @protected */
        this.anyAxisDevice = '';
        /** @protected */
        this.anyAxisCode = '';

        /**
         * @private
         * @type {Record<InputContextEventType, Array<InputContextEventListener>>}
         */
        this.listeners = {
            bind: [],
            unbind: [],
            focus: [],
            blur: [],
        };

        // Prepare listeners
        /** @private */
        this.onInput = this.onInput.bind(this);
        /** @private */
        this.onEventTargetBlur = this.onEventTargetBlur.bind(this);
        /** @private */
        this.onEventTargetFocus = this.onEventTargetFocus.bind(this);

        // Attach listeners
        eventTarget.addEventListener('focus', this.onEventTargetFocus);
        eventTarget.addEventListener('blur', this.onEventTargetBlur);
        for(let device of this.devices)
        {
            device.addEventListener('input', this.onInput);
        }
    }

    get autopoll()
    {
        return this.autopoller.running;
    }

    set autopoll(value = undefined)
    {
        this.toggleAutoPoll(value);
    }

    destroy()
    {
        let listeners = this.listeners;
        for(let event in listeners)
        {
            listeners[event].length = 0;
        }
        if (this.autopoller.running)
        {
            this.autopoller.stop();
        }
        for(let device of this.devices)
        {
            device.removeEventListener('input', this.onInput);
            device.destroy();
        }
        let eventTarget = this.eventTarget;
        eventTarget.removeEventListener('focus', this.onEventTargetFocus);
        eventTarget.removeEventListener('blur', this.onEventTargetBlur);
    }

    setEventTarget(eventTarget)
    {
        let oldEventTarget = this.eventTarget;
        oldEventTarget.removeEventListener('focus', this.onEventTargetFocus);
        oldEventTarget.removeEventListener('blur', this.onEventTargetBlur);
        
        this.eventTarget = eventTarget;
        for(let device of this.devices)
        {
            device.setEventTarget(eventTarget);
        }
        eventTarget.addEventListener('focus', this.onEventTargetFocus);
        eventTarget.addEventListener('blur', this.onEventTargetBlur);
    }

    toggleAutoPoll(force = undefined)
    {
        let current = this.autopoller.running;
        let next = typeof force === 'undefined' ? !current : Boolean(force);
        if (next === current) return;
        if (next)
        {
            this.autopoller.start();
        }
        else
        {
            this.autopoller.stop();
        }
    }

    /**
     * @param {InputContextEventType} event
     * @param {InputContextEventListener} listener 
     */
    addEventListener(event, listener)
    {
        let listeners = this.listeners;
        if (event in listeners)
        {
            listeners[event].push(listener);
        }
        else
        {
            listeners[event] = [listener];
        }
    }

    /**
     * @param {InputContextEventType} event 
     * @param {InputContextEventListener} listener
     */
    removeEventListener(event, listener)
    {
        let listeners = this.listeners;
        if (event in listeners)
        {
            let list = listeners[event];
            let i = list.indexOf(listener);
            if (i >= 0)
            {
                list.splice(i, 1);
            }
        }
    }

    /**
     * @param {InputContextEvent} e
     * @returns {boolean} Whether the event should be consumed.
     */
    dispatchEvent(e)
    {
        const { type } = e;
        let flag = 0;
        for(let listener of this.listeners[type])
        {
            flag |= listener(e);
        }
        return Boolean(flag);
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
        this.dispatchEvent({
            type: 'bind'
        });
    }

    /** @private */
    onUnbind()
    {
        this.dispatchEvent({
            type: 'unbind'
        });
    }

    /** @private */
    onEventTargetFocus()
    {
        this.dispatchEvent({
            type: 'focus'
        });
    }

    /** @private */
    onEventTargetBlur()
    {
        // Clear all input states.
        for(let input of this.bindings.getInputs())
        {
            input.onStatus(0, 0);
        }
        this.anyButton.onStatus(0, 0);
        this.anyAxis.onStatus(0, 0);
        this.dispatchEvent({
            type: 'blur'
        });
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
        return this.inputs[name].value;
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
}
