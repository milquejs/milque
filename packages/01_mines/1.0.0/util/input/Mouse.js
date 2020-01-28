export class Mouse
{
    constructor()
    {
        this.sourceElement = null;
        this.eventHandler = null;

        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
    }

    attach(sourceElement = document)
    {
        this.sourceElement = sourceElement;
        this.sourceElement.addEventListener('mousedown', this.onMouseDown);
        this.sourceElement.addEventListener('mouseup', this.onMouseUp);
        this.sourceElement.addEventListener('contextmenu', this.onContextMenu);
        document.addEventListener('mousemove', this.onMouseMove);
        return this;
    }

    detach()
    {
        this.sourceElement.removeEventListener('mousedown', this.onMouseDown);
        this.sourceElement.removeEventListener('mouseup', this.onMouseUp);
        this.sourceElement.removeEventListener('contextmenu', this.onContextMenu);
        document.removeEventListener('mousemove', this.onMouseMove);
        this.sourceElement = null;
        return this;
    }

    setEventHandler(eventHandler)
    {
        this.eventHandler = eventHandler;
        return this;
    }

    onMouseDown(e)
    {
        if (!this.eventHandler) return;
        
        e.preventDefault();
        e.stopPropagation();
        
        this.eventHandler.call(this, `mouse[${e.button}].down`, true);
    }

    onMouseUp(e)
    {
        if (!this.eventHandler) return;

        e.preventDefault();
        e.stopPropagation();
        
        this.eventHandler.call(this, `mouse[${e.button}].up`, true);
    }

    onMouseMove(e)
    {
        if (!this.eventHandler) return;

        e.preventDefault();
        e.stopPropagation();

        const clientCanvas = this.sourceElement;
        const clientWidth = clientCanvas.clientWidth;
        const clientHeight = clientCanvas.clientHeight;
        
        this.eventHandler.call(this, 'mouse[pos].x', (e.pageX - clientCanvas.offsetLeft) / clientWidth);
        this.eventHandler.call(this, 'mouse[pos].y', (e.pageY - clientCanvas.offsetTop) / clientHeight);
        this.eventHandler.call(this, 'mouse[pos].dx', e.movementX / clientWidth);
        this.eventHandler.call(this, 'mouse[pos].dy', e.movementY / clientHeight);
    }

    onContextMenu(e)
    {
        e.preventDefault();
        e.stopPropagation();
    }
}
