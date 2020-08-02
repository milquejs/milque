import { InputDevice, Button } from './InputDevice.js';

const KEYBOARD_CONTEXT_KEY = Symbol('keyboardEventContext');

export class Keyboard extends InputDevice
{
    /** @override */
    static addInputEventListener(eventTarget, listener)
    {
        let ctx;
        if (!(KEYBOARD_CONTEXT_KEY in listener))
        {
            ctx = {
                handler: listener,
                target: eventTarget,
                down: null,
                up: null,
                _keyEvent: {
                    type: 'key',
                    target: eventTarget,
                    device: 'keyboard',
                    key: null,
                    event: null,
                    value: null,
                    control: false,
                    shift: false,
                    alt: false,
                },
            };
    
            let down = onKeyDown.bind(ctx);
            let up = onKeyUp.bind(ctx);
        
            ctx.down = down;
            ctx.up = up;
        
            listener[KEYBOARD_CONTEXT_KEY] = ctx;
        }
        else
        {
            ctx = listener[KEYBOARD_CONTEXT_KEY];
        }

        eventTarget.addEventListener('keyup', ctx.up);
        eventTarget.addEventListener('keydown', ctx.down);
    
        return eventTarget;
    }

    /** @override */
    static removeInputEventListener(eventTarget, listener)
    {
        if (KEYBOARD_CONTEXT_KEY in listener)
        {
            let ctx = listener[KEYBOARD_CONTEXT_KEY];
        
            eventTarget.removeEventListener('keyup', ctx.up);
            eventTarget.removeEventListener('keydown', ctx.down);
        }
    
        return eventTarget;
    }

    constructor(eventTarget, keyList = undefined)
    {
        super(eventTarget);

        this._buttons = [];
        this._managed = Array.isArray(keyList);

        this.onManagedKeyEvent = this.onManagedKeyEvent.bind(this);
        this.onUnmanagedKeyEvent = this.onUnmanagedKeyEvent.bind(this);

        if (this._managed)
        {
            for(let key of keyList)
            {
                let button = new Button();
                this[key] = button;
                this._buttons.push(button);
            }

            Keyboard.addInputEventListener(eventTarget, this.onManagedKeyEvent);
        }
        else
        {
            Keyboard.addInputEventListener(eventTarget, this.onUnmanagedKeyEvent);
        }
    }

    get Up() { return Math.min((this.ArrowUp || 0) + (this.KeyW || 0), 1); }
    get Down() { return Math.min((this.ArrowDown || 0) + (this.KeyS || 0), 1); }
    get Left() { return Math.min((this.ArrowLeft || 0) + (this.KeyA || 0), 1); }
    get Right() { return Math.min((this.ArrowRight || 0) + (this.KeyD || 0), 1); }

    destroy()
    {
        if (this._managed)
        {
            Keyboard.removeInputEventListener(this.eventTarget, this.onManagedKeyEvent);
        }
        else
        {
            Keyboard.removeInputEventListener(this.eventTarget, this.onUnmanagedKeyEvent);
        }
        this.eventTarget = null;
    }

    poll()
    {
        for(let button of this._buttons)
        {
            button.poll();
        }
        return this;
    }

    onUnmanagedKeyEvent(e)
    {
        if (!(e.key in this))
        {
            let button = new Button();
            this[e.key] = button;
            this._buttons.push(button);
        }
        
        this[e.key].update(e.event, e.value);
        
        return true;
    }

    onManagedKeyEvent(e)
    {
        if (e.key in this)
        {
            this[e.key].update(e.event, e.value);

            return true;
        }
    }
}

function onKeyDown(e)
{
    // Ignore repeat events.
    if (e.repeat)
    {
        e.preventDefault();
        e.stopPropagation();
        return false;
    }

    let event = this._keyEvent;
    // NOTE: You could use `e.key`, but we care about location rather than printable character.
    event.key = e.code;
    event.event = 'down';
    event.value = 1;
    event.control = e.ctrlKey;
    event.shift = e.shiftKey;
    event.alt = e.altKey;

    let result = this.handler.call(undefined, event);

    if (result)
    {
        e.preventDefault();
        e.stopPropagation();
        return false;
    }
}

function onKeyUp(e)
{
    let event = this._keyEvent;
    // NOTE: You could use `e.key`, but we care about location rather than printable character.
    event.key = e.code;
    event.event = 'up';
    event.value = 1;
    event.control = e.ctrlKey;
    event.shift = e.shiftKey;
    event.alt = e.altKey;

    let result = this.handler.call(undefined, event);

    if (result)
    {
        e.preventDefault();
        e.stopPropagation();
        return false;
    }
}
