import { InputDevice } from './InputDevice.js';
import { createButton, nextButton, pollButton } from './KeyButton.js';

const MOUSE_CONTEXT_KEY = Symbol('mouseEventContext');

export class Mouse extends InputDevice
{
    /** @override */
    static addInputEventListener(eventTarget, listener)
    {
        let ctx;
        if (!(MOUSE_CONTEXT_KEY in listener))
        {
            ctx = {
                handler: listener,
                target: eventTarget,
                down: null,
                up: null,
                move: null,
                contextmenu: null,
                _down: false,
                _keyEvent: {
                    type: 'key',
                    target: eventTarget,
                    device: 'mouse',
                    key: null,
                    event: null,
                    value: null,
                },
                _posEvent: {
                    type: 'pos',
                    target: eventTarget,
                    device: 'mouse',
                    key: 'pos',
                    event: 'move',
                    x: 0, y: 0, dx: 0, dy: 0,
                },
            };
    
            let down = onMouseDown.bind(ctx);
            let up = onMouseUp.bind(ctx);
            let move = onMouseMove.bind(ctx);
            let contextmenu = onContextMenu.bind(ctx);
        
            ctx.down = down;
            ctx.up = up;
            ctx.move = move;
            ctx.contextmenu = contextmenu;
        
            listener[MOUSE_CONTEXT_KEY] = ctx;
        }
        else
        {
            ctx = listener[MOUSE_CONTEXT_KEY];
        }
    
        eventTarget.addEventListener('mousedown', ctx.down);
        document.addEventListener('mouseup', ctx.up);
        eventTarget.addEventListener('contextmenu', ctx.contextmenu);
        document.addEventListener('mousemove', ctx.move);
    
        return eventTarget;
    }

    /** @override */
    static removeInputEventListener(eventTarget, listener)
    {
        if (MOUSE_CONTEXT_KEY in listener)
        {
            let ctx = listener[MOUSE_CONTEXT_KEY];
        
            eventTarget.removeEventListener('mousedown', ctx.down);
            document.removeEventListener('mouseup', ctx.up);
            eventTarget.removeEventListener('contextmenu', ctx.contextmenu);
            document.removeEventListener('mousemove', ctx.move);
        }
    
        return eventTarget;
    }

    constructor(eventTarget)
    {
        super(eventTarget);

        this.x = 0;
        this.y = 0;

        this.dx = 0;
        this.dy = 0;
        this.nextdx = 0;
        this.nextdy = 0;

        this.left = createButton();
        this.middle = createButton();
        this.right = createButton();
        this.button3 = createButton();
        this.button4 = createButton();

        this.onMouseEvent = this.onMouseEvent.bind(this);

        Mouse.addInputEventListener(eventTarget, this.onMouseEvent);
    }

    destroy()
    {
        Mouse.removeInputEventListener(this.eventTarget, this.onMouseEvent);
        this.eventTarget = null;
    }

    poll()
    {
        this.dx = this.nextdx;
        this.dy = this.nextdy;
        this.nextdx = 0;
        this.nextdy = 0;

        pollButton(this.left);
        pollButton(this.middle);
        pollButton(this.right);
        pollButton(this.button3);
        pollButton(this.button4);

        return this;
    }

    onMouseEvent(e)
    {
        switch(e.key)
        {
            case 0:
                nextButton(this.left, e.event, e.value);
                break;
            case 1:
                nextButton(this.middle, e.event, e.value);
                break;
            case 2:
                nextButton(this.right, e.event, e.value);
                break;
            case 3:
                nextButton(this.button3, e.event, e.value);
                break;
            case 4:
                nextButton(this.button4, e.event, e.value);
                break;
            case 'pos':
                this.x = e.x;
                this.y = e.y;
                this.nextdx += e.dx;
                this.nextdy += e.dy;
                
                // Cannot consume a position event.
                return;
        }

        return true;
    }
}

function onMouseDown(e)
{
    this._down = true;

    let event = this._keyEvent;
    event.key = e.button;
    event.event = 'down';
    event.value = 1;

    let result = this.handler.call(undefined, event);

    if (result)
    {
        e.preventDefault();
        e.stopPropagation();
        return false;
    }
}

function onMouseUp(e)
{
    if (this._down)
    {
        this._down = false;

        let event = this._keyEvent;
        event.key = e.button;
        event.event = 'up';
        event.value = 1;
        
        let result = this.handler.call(undefined, event);
    
        if (result)
        {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
    }
}

function onMouseMove(e)
{
    let element = this.target;
    let { clientWidth, clientHeight } = element;

    let dx = e.movementX / clientWidth;
    let dy = e.movementY / clientHeight;
    let x = (e.pageX - element.offsetLeft) / clientWidth;
    let y = (e.pageY - element.offsetTop) / clientHeight;

    let event = this._posEvent;
    event.x = x;
    event.y = y;
    event.dx = dx;
    event.dy = dy;

    let result = this.handler.call(undefined, event);

    if (typeof result !== 'undefined')
    {
        throw new Error(`Return value must be 'undefined'. Mouse position and movement events cannot be consumed.`);
    }
}

function onContextMenu(e)
{
    e.preventDefault();
    e.stopPropagation();
    return false;
}
