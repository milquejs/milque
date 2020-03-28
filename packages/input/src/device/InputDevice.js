export class InputDevice
{
    constructor(name = undefined)
    {
        this.name = name || this.constructor.name.toLowerCase();
        
        this._eventTarget = null;
        this._eventHandlers = [];
    }

    setEventTarget(eventTarget)
    {
        if (this._eventTarget)
        {
            this.detachEventTarget(this._eventTarget);
            this._eventTarget = null;
        }

        if (eventTarget)
        {
            this.attachEventTarget(eventTarget);
            this._eventTarget = eventTarget;
        }

        return this;
    }

    getEventTarget() { return this._eventTarget; }

    /**
     * @protected
     * @abstract
     */
    attachEventTarget(eventTarget) {}

    /**
     * @protected
     * @abstract
     */
    detachEventTarget(eventTarget) {}
    
    addEventHandler(eventHandler) { this._eventHandlers.push(eventHandler); }
    
    removeEventHandler(eventHandler)
    {
        let index = this._eventHandlers.indexOf(eventHandler);
        if (index >= 0)
        {
            this._eventHandlers.splice(index, 1);
        }
    }

    getEventHandlers() { return this._eventHandlers; }

    clearEventHandlers() { this._eventHandlers.length = 0; }

    handleEvent(code, event, value = true)
    {
        let result = false;
        for(let eventHandler of this._eventHandlers)
        {
            result = eventHandler.call(undefined, this.name, code, event, value);
            if (result) break;
        }
        return Boolean(result);
    }
}
