export class Keyboard
{
    constructor()
    {
        this.sourceElement = null;
        this.eventHandler = null;

        this.onKeyDown = this.onKeyDown.bind(this);
        this.onKeyUp = this.onKeyUp.bind(this);
    }

    attach(sourceElement = document)
    {
        this.sourceElement = sourceElement;
        this.sourceElement.addEventListener('keydown', this.onKeyDown);
        this.sourceElement.addEventListener('keyup', this.onKeyUp);
        return this;
    }

    detach()
    {
        this.sourceElement.removeEventListener('keydown', this.onKeyDown);
        this.sourceElement.removeEventListener('keyup', this.onKeyUp);
        this.sourceElement = null;
        return this;
    }

    setEventHandler(eventHandler)
    {
        this.eventHandler = eventHandler;
        return this;
    }

    onKeyDown(e)
    {
        if (!this.eventHandler) return;

        let result;
        if (e.repeat)
        {
            result = this.eventHandler.call(this, `key[${e.key}].repeat`, true);
        }
        else
        {
            result = this.eventHandler.call(this, `key[${e.key}].down`, true);
        }

        if (result)
        {
            e.preventDefault();
            e.stopPropagation();
        }
    }

    onKeyUp(e)
    {
        if (!this.eventHandler) return;

        let result;
        result = this.eventHandler.call(this, `key[${e.key}].up`, true);
        
        if (result)
        {
            e.preventDefault();
            e.stopPropagation();
        }
    }
}
