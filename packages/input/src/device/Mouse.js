import { InputDevice } from './InputDevice.js';

export class Mouse extends InputDevice
{
    constructor(eventTarget)
    {
        super();
        
        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
        this.onContextMenu = this.onContextMenu.bind(this);

        this.name = 'mouse';
        this.eventTarget = null;
        this.setEventTarget(eventTarget);
    }

    setEventTarget(element)
    {
        if (this.eventTarget) this.destroy();

        if (!element) return;
        element.addEventListener('mousedown', this.onMouseDown);
        element.addEventListener('mouseup', this.onMouseUp);
        element.addEventListener('mousemove', this.onMouseMove);
        element.addEventListener('contextmenu', this.onContextMenu);
        this.eventTarget = element;
    }

    destroy()
    {
        let element = this.eventTarget;
        this.eventTarget = null;

        if (!element) return;
        element.removeEventListener('mousedown', this.onMouseDown);
        element.removeEventListener('mouseup', this.onMouseUp);
        element.removeEventListener('mousemove', this.onMouseMove);
        element.removeEventListener('contextmenu', this.onContextMenu);
    }

    onMouseDown(e)
    {
        if ('key' in this.listeners)
        {
            // Ignore repeat events.
            if (e.repeat) return;
            
            let result = this.dispatchEvent({
                type: 'key',
                target: this.eventTarget,
                device: this.name,
                key: e.button,
                event: 'down',
                value: 1,
            });

            if (!result)
            {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }
        }
    }

    onMouseUp(e)
    {
        if ('key' in this.listeners)
        {
            let result = this.dispatchEvent({
                type: 'key',
                target: this.eventTarget,
                device: this.name,
                key: e.button,
                event: 'up',
                value: 1,
            });

            if (!result)
            {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }
        }
    }

    onMouseMove(e)
    {
        if ('pos' in this.listeners)
        {
            let element = this.eventTarget;
            let { clientWidth, clientHeight } = element;

            let dx = e.movementX / clientWidth;
            let dy = e.movementY / clientHeight;
            let x = (e.pageX - element.offsetLeft) / clientWidth;
            let y = (e.pageY - element.offsetTop) / clientHeight;

            let result = this.dispatchEvent({
                type: 'pos',
                target: this.eventTarget,
                device: this.name,
                key: 'pos',
                x, y, dx, dy,
            });

            if (!result)
            {
                throw new Error('Return value must be undefined. Mouse position and movement events cannot be consumed.');
            }
        }
    }

    onContextMenu(e)
    {
        e.preventDefault();
        e.stopPropagation();
        return false;
    }
}
