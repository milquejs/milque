export class Keyboard
{
    constructor()
    {
        this.eventHandler = null;

        this.onKeyDown = this.onKeyDown.bind(this);
        this.onKeyUp = this.onKeyUp.bind(this);

        document.addEventListener('keydown', this.onKeyDown);
        document.addEventListener('keyup', this.onKeyUp);
    }

    destroy()
    {
        document.removeEventListener('keydown', this.onKeyDown);
        document.removeEventListener('keyup', this.onKeyUp);
    }

    setEventHandler(eventHandler)
    {
        this.eventHandler = eventHandler;
        return this;
    }

    onKeyDown(e)
    {
        if (!this.eventHandler) return;

        if (e.repeat)
        {
            this.eventHandler.call(this, `key[${e.key}].repeat`, true);
        }
        else
        {
            this.eventHandler.call(this, `key[${e.key}].down`, true);
        }
    }

    onKeyUp(e)
    {
        if (!this.eventHandler) return;
        
        this.eventHandler.call(this, `key[${e.key}].up`, true);
    }
}

export class Mouse
{
    constructor()
    {
        this.eventHandler = null;

        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
    }

    destroy()
    {
    }

    setEventHandler(eventHandler)
    {
        this.eventHandler = eventHandler;
        return this;
    }

    onMouseDown(e)
    {
        if (!this.eventHandler) return;
        
        this.eventHandler.call(this, `mouse[${e.button}].down`, true);
    }

    onMouseUp(e)
    {
        if (!this.eventHandler) return;
        
        this.eventHandler.call(this, `mouse[${e.button}].up`, true);
    }

    onMouseMove(e)
    {
        if (!this.eventHandler) return;
        
        this.eventHandler.call(this, 'mouse[pos].x', e.pageX);
        this.eventHandler.call(this, 'mouse[pos].y', e.pageY);
        this.eventHandler.call(this, 'mouse[pos].dx', e.movementX);
        this.eventHandler.call(this, 'mouse[pos].dy', e.movementY);
    }
}
