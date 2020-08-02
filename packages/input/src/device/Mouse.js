import { InputDevice, Button, Axis, AggregatedAxis } from './InputDevice.js';

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

        this.x = new Axis();
        this.y = new Axis();
        this.dx = new AggregatedAxis();
        this.dy = new AggregatedAxis();
        this.Button0 = new Button();
        this.Button1 = new Button();
        this.Button2 = new Button();
        this.Button3 = new Button();
        this.Button4 = new Button();

        this.onMouseEvent = this.onMouseEvent.bind(this);

        Mouse.addInputEventListener(eventTarget, this.onMouseEvent);
    }

    get Left() { return this.Button0; }
    get Middle() { return this.Button1; }
    get Right() { return this.Button2; }

    destroy()
    {
        Mouse.removeInputEventListener(this.eventTarget, this.onMouseEvent);
        this.eventTarget = null;
    }

    poll()
    {
        this.x.poll();
        this.y.poll();
        this.dx.poll();
        this.dy.poll();
        this.Button0.poll();
        this.Button1.poll();
        this.Button2.poll();
        this.Button3.poll();
        this.Button4.poll();

        return this;
    }

    onMouseEvent(e)
    {
        let { key, event } = e;
        switch(key)
        {
            case 0:
                this.Button0.update(event, e.value);
                break;
            case 1:
                this.Button1.update(event, e.value);
                break;
            case 2:
                this.Button2.update(event, e.value);
                break;
            case 3:
                this.Button3.update(event, e.value);
                break;
            case 4:
                this.Button4.update(event, e.value);
                break;
            case 'pos':
                this.x.update(event, e.x);
                this.y.update(event, e.y);
                this.dx.update(event, e.dx);
                this.dy.update(event, e.dy);
                
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
        if (document.activeElement === this.target)
        {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
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

    let rect = this.target.getBoundingClientRect();

    let dx = e.movementX / clientWidth;
    let dy = e.movementY / clientHeight;
    let x = (e.clientX - rect.left) / clientWidth;
    let y = (e.clientY - rect.top) / clientHeight;

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
