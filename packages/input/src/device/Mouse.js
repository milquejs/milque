import { InputDevice } from './InputDevice.js';

export class Mouse extends InputDevice
{
    constructor()
    {
        super();

        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
        this.onContextMenu = this.onContextMenu.bind(this);
    }

    /**
     * @protected
     * @override
     */
    attachEventTarget(eventTarget)
    {
        eventTarget.addEventListener('mousedown', this.onMouseDown);
        eventTarget.addEventListener('mouseup', this.onMouseUp);
        eventTarget.addEventListener('contextmenu', this.onContextMenu);
        document.addEventListener('mousemove', this.onMouseMove);
    }

    /**
     * @protected
     * @override
     */
    detachEventTarget(eventTarget)
    {
        eventTarget.removeEventListener('mousedown', this.onMouseDown);
        eventTarget.removeEventListener('mouseup', this.onMouseUp);
        eventTarget.removeEventListener('contextmenu', this.onContextMenu);
        document.removeEventListener('mousemove', this.onMouseMove);
    }
    
    /** @private */
    onMouseDown(e)
    {
        let result;

        result = this.handleEvent(e.button, 'down', true);

        if (result)
        {
            e.preventDefault();
            e.stopPropagation();
        }
    }

    /** @private */
    onMouseUp(e)
    {
        let result;

        result = this.handleEvent(e.button, 'up', true);

        if (result)
        {
            e.preventDefault();
            e.stopPropagation();
        }
    }

    /** @private */
    onMouseMove(e)
    {
        const eventTarget = this._eventTarget;
        const clientWidth = eventTarget.clientWidth;
        const clientHeight = eventTarget.clientHeight;
        
        this.handleEvent('pos', 'x', (e.pageX - eventTarget.offsetLeft) / clientWidth);
        this.handleEvent('pos', 'y', (e.pageY - eventTarget.offsetTop) / clientHeight);
        this.handleEvent('pos', 'dx', e.movementX / clientWidth);
        this.handleEvent('pos', 'dy', e.movementY / clientHeight);
    }

    /** @private */
    onContextMenu(e)
    {
        e.preventDefault();
        e.stopPropagation();
    }
}
