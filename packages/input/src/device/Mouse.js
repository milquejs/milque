import { createButton, nextButton, pollButton } from './KeyButton.js';

const MOUSE_CONTEXT_KEY = Symbol('mouseEventContext');

export class Mouse
{
    /** @override */
    static addInputEventListener(eventTarget, listener)
    {
        let ctx;
        if (!(MOUSE_CONTEXT_KEY in mouseEventHandler))
        {
            ctx = {
                handler: mouseEventHandler,
                target: elementTarget,
                down: null,
                up: null,
                move: null,
                contextmenu: null,
                _down: false,
                _keyEvent: {
                    type: 'key',
                    target: elementTarget,
                    device: 'mouse',
                    key: null,
                    event: null,
                    value: null,
                },
                _posEvent: {
                    type: 'pos',
                    target: elementTarget,
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
        
            mouseEventHandler[MOUSE_CONTEXT_KEY] = ctx;
        }
        else
        {
            ctx = mouseEventHandler[MOUSE_CONTEXT_KEY];
        }
    
        elementTarget.addEventListener('mousedown', ctx.down);
        document.addEventListener('mouseup', ctx.up);
        elementTarget.addEventListener('contextmenu', ctx.contextmenu);
        document.addEventListener('mousemove', ctx.move);
    
        return elementTarget;
    }

    /** @override */
    static removeInputEventListener(eventTarget, listener)
    {
        if (MOUSE_CONTEXT_KEY in mouseEventHandler)
        {
            let ctx = mouseEventHandler[MOUSE_CONTEXT_KEY];
        
            elementTarget.removeEventListener('mousedown', ctx.down);
            document.removeEventListener('mouseup', ctx.up);
            elementTarget.removeEventListener('contextmenu', ctx.contextmenu);
            document.removeEventListener('mousemove', ctx.move);
        }
    
        return elementTarget;
    }

    constructor(eventTarget)
    {
        super(eventTarget);

        this.x = 0;
        this.y = 0;

        this.dx = 0;
        this.dy = 0;
        this.nextDx = 0;
        this.nextDy = 0;

        this.left = createButton();
        this.middle = createButton();
        this.right = createButton();
        this.button3 = createButton();
        this.button4 = createButton();

        this.onMouseEvent = this.onMouseEvent.bind(this);

        addMouseEventListener(eventTarget, this.onMouseEvent);
    }

    destroy()
    {
        removeMouseEventListener(this.eventTarget, this.onMouseEvent);
        this.eventTarget = null;
    }

    poll()
    {
        this.dx = this.nextDx;
        this.dy = this.nextDy;
        this.nextDx = 0;
        this.nextDy = 0;

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
                this.nextDx += e.dx;
                this.nextDy += e.dy;
                
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
