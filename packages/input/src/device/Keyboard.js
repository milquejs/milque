import { createButton, nextButton, pollButton } from './KeyButton.js';

export class Keyboard
{
    constructor(eventTarget)
    {
        this.target = eventTarget;

        this._buttons = [];

        this.onKeyEvent = this.onKeyEvent.bind(this);

        addKeyboardEventListener(eventTarget, this.onKeyEvent);
    }

    destroy()
    {
        removeKeyboardEventListener(this.target, this.onKeyEvent);
        this.target = null;
    }

    poll()
    {
        for(let button of this._buttons)
        {
            pollButton(button);
        }
        return this;
    }

    onKeyEvent(e)
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
}

const KEYBOARD_CONTEXT_KEY = Symbol('keyboardEventContext');

export function addKeyboardEventListener(elementTarget, keyboardEventHandler)
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

export function removeKeyboardEventListener(elementTarget, keyboardEventHandler)
{
    if (KEYBOARD_CONTEXT_KEY in keyboardEventHandler)
    {
        let ctx = keyboardEventHandler[KEYBOARD_CONTEXT_KEY];
    
        elementTarget.removeEventListener('keyup', ctx.up);
        elementTarget.removeEventListener('keydown', ctx.down);
    }

    return elementTarget;
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
