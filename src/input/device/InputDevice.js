class InputDevice
{
    constructor(name)
    {
        this.name = name;
        this.listeners = new Map();
    }

    delete()
    {
        this.listeners.clear();
    }

    addEventListener(event, listener)
    {
        if (this.listeners.has(event))
        {
            this.listeners.get(event).push(listener);
        }
        else
        {
            this.listeners.set(event, [listener]);
        }
    }

    removeEventListener(event, listener)
    {
        if (this.listeners.has(event))
        {
            const listeners = this.listeners.get(event);
            const index = listener.indexOf(listener);
            if (index >= 0)
            {
                listeners.splice(index, 1);
            }
        }
    }

    dispatchEvent(event, inputKey, inputEvent, inputValue, ...args)
    {
        if (this.listeners.has(event))
        {
            for(const listener of this.listeners.get(event))
            {
                listener.call(null, this, inputKey, inputEvent, inputValue, ...args);
            }
        }
    }
}

export default InputDevice;