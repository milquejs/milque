import { createButton, nextButton, pollButton } from './KeyButton.js';
import { InputDevice } from './InputDevice.js';

const KEYBOARD_CONTEXT_KEY = Symbol('keyboardEventContext');

export class Keyboard extends InputDevice
{
    /** @override */
    static addInputEventListener(eventTarget, listener)
    {
        let ctx;
        if (!(KEYBOARD_CONTEXT_KEY in keyboardEventHandler))
        {
            ctx = {
                handler: keyboardEventHandler,
                target: elementTarget,
                down: null,
                up: null,
                _keyEvent: {
                    type: 'key',
                    target: elementTarget,
                    device: 'keyboard',
                    key: null,
                    event: null,
                    value: null,
                },
            };
    
            let down = onKeyDown.bind(ctx);
            let up = onKeyUp.bind(ctx);
        
            ctx.down = down;
            ctx.up = up;
        
            keyboardEventHandler[KEYBOARD_CONTEXT_KEY] = ctx;
        }
        else
        {
            ctx = keyboardEventHandler[KEYBOARD_CONTEXT_KEY];
        }
    
        elementTarget.addEventListener('keyup', ctx.up);
        elementTarget.addEventListener('keydown', ctx.down);
    
        return elementTarget;
    }

    /** @override */
    static removeInputEventListener(eventTarget, listener)
    {
        if (KEYBOARD_CONTEXT_KEY in keyboardEventHandler)
        {
            let ctx = keyboardEventHandler[KEYBOARD_CONTEXT_KEY];
        
            elementTarget.removeEventListener('keyup', ctx.up);
            elementTarget.removeEventListener('keydown', ctx.down);
        }
    
        return elementTarget;
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
                let button = createButton();
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
            pollButton(button);
        }
        return this;
    }

    onUnmanagedKeyEvent(e)
    {
        if (!(e.key in this))
        {
            let button = createButton();
            this[e.key] = button;
            this._buttons.push(button);
        }
        
        nextButton(this[e.key], e.event, e.value);

        return false;
    }

    onManagedKeyEvent(e)
    {
        if (e.key in this)
        {
            nextButton(this[e.key], e.event, e.value);
        }

        return false;
    }
}

function onKeyDown(e)
{
    // Ignore repeat events.
    if (e.repeat) return;

    let event = this._keyEvent;
    event.key = e.key;
    event.event = 'down';
    event.value = 1;

    let result = this.handler.call(undefined, event);

    if (!result)
    {
        e.preventDefault();
        e.stopPropagation();
        return false;
    }
}

function onKeyUp(e)
{
    let event = this._keyEvent;
    event.key = e.key;
    event.event = 'up';
    event.value = 1;

    let result = this.handler.call(undefined, event);

    if (!result)
    {
        e.preventDefault();
        e.stopPropagation();
        return false;
    }
}
