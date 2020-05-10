function createButton()
{
    return {
        up: 0,
        down: 0,
        state: 0,
        next: {
            up: 0,
            down: 0,
        },
    };
}

function nextButton(button, event, value)
{
    if (event === 'down')
    {
        button.next.down = value;
    }
    else
    {
        button.next.up = value;
    }
}

function pollButton(button)
{
    if (button.state)
    {
        if (button.up && !button.next.up)
        {
            button.state = 0;
        }
    }
    else if (button.next.down)
    {
        button.state = 1;
    }

    button.down = button.next.down;
    button.up = button.next.up;

    button.next.down = 0;
    button.next.up = 0;
}

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

    elementTarget.addEventListener('keyup', ctx.down);
    elementTarget.addEventListener('keydown', ctx.up);

    return elementTarget;
}

export function removeKeyboardEventListener(elementTarget, keyboardEventHandler)
{
    if (KEYBOARD_CONTEXT_KEY in keyboardEventHandler)
    {
        let ctx = keyboardEventHandler[KEYBOARD_CONTEXT_KEY];
    
        elementTarget.removeEventListener('keyup', ctx.down);
        elementTarget.removeEventListener('keydown', ctx.up);
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
