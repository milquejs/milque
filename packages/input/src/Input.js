export class Input
{
    constructor(inputName, inputType)
    {
        this.inputName = inputName;
        this.inputType = inputType;
        
        this.value = 0;

        this._onchange = null;
        this._eventListeners = new Map();
    }

    update(value)
    {
        if (this.value !== value)
        {
            this.value = value;
            
            if (this._eventListeners.has('change'))
            {
                for(let listener of this._eventListeners.get('change'))
                {
                    listener.call(undefined, this);
                }
            }

            return true;
        }
        return false;
    }

    get onchange()
    {
        return this._onchange;
    }

    set onchange(callback)
    {
        if (this._onchange)
        {
            this.removeEventListener('change', this._onchange);
        }

        this._onchange = callback;
        this.addEventListener('change', callback);
    }

    addEventListener(event, listener)
    {
        if (this._eventListeners.has(event))
        {
            let listeners = this._eventListeners.get(event);
            listeners.push(listener);
        }
        else
        {
            this._eventListeners.set(event, [ listener ]);
        }
    }

    removeEventListener(event, listener)
    {
        if (this._eventListeners.has(event))
        {
            let listeners = this._eventListeners.get(event);
            listeners.splice(listeners.indexOf(listener), 1);
        }
    }

    /** @override */
    toString()
    {
        return this.value;
    }
}
