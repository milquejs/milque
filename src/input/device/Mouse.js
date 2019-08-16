import InputDevice from './InputDevice.js';

class Mouse extends InputDevice
{
    constructor(element, allowCursorLock = false)
    {
        super('mouse');

        this.element = element;
        this.allowCursorLock = allowCursorLock;

        this.onMouseMove = this.onMouseMove.bind(this);
        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
        this._down = false;

        element.addEventListener('mousedown', this.onMouseDown, false);
        document.addEventListener('mousemove', this.onMouseMove, false);

        this.onMouseClick = this.onMouseClick.bind(this);
        element.addEventListener('click', this.onMouseClick, false);
    }

    /** @override */
    delete()
    {
        if (this.hasPointerLock())
        {
            document.exitPointerLock();
        }

        this.element.removeEventListener('mousedown', this.onMouseDown);
        document.removeEventListener('mousemove', this.onMouseMove);
        document.removeEventListener('mouseup', this.onMouseUp);
        this.element.removeEventListener('click', this.onMouseClick);

        super.delete();
    }

    onMouseClick(e)
    {
        if (this.allowCursorLock)
        {
            this.element.requestPointerLock();
        }
    }

    onMouseMove(e)
    {
        if (this.allowCursorLock && !this.hasPointerLock()) return;

        this.dispatchEvent('input', 'move', 'x', e.movementX);
        this.dispatchEvent('input', 'move', 'y', e.movementY);

        if (this.element instanceof Element)
        {
            const rect = this.element.getBoundingClientRect();
            this.dispatchEvent('input', 'pos', 'x', e.clientX - rect.left);
            this.dispatchEvent('input', 'pos', 'y', e.clientY - rect.top);
        }
        else
        {
            this.dispatchEvent('input', 'pos', 'x', e.clientX);
            this.dispatchEvent('input', 'pos', 'y', e.clientY);
        }
    }

    onMouseDown(e)
    {
        if (this.allowCursorLock && !this.hasPointerLock()) return;

        if (this._down)
        {
            document.removeEventListener('mouseup', this.onMouseUp);
        }

        this._down = true;
        document.addEventListener('mouseup', this.onMouseUp, false);

        this.dispatchEvent('input', e.button, 'down', true, e.clientX, e.clientY);
    }

    onMouseUp(e)
    {
        if (this.allowCursorLock && !this.hasPointerLock()) return;

        document.removeEventListener('mouseup', this.onMouseUp);
        this._down = false;
        
        this.dispatchEvent('input', e.button, 'up', true, e.clientX, e.clientY);
    }

    hasPointerLock()
    {
        return document.pointerLockElement === this.element;
    }
}

export default Mouse;