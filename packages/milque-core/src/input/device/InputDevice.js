class InputDevice
{
    constructor()
    {
        this.name = 'input';
        this.inputListeners = [];

        this.listeners = new Map();
    }

    setName(name)
    {
        this.name = name;
        return this;
    }

    delete()
    {
        this.inputListeners.length = 0;
        this.listeners.clear();
    }

    addInputListener(listener)
    {
        this.inputListeners.push(listener);
    }

    removeInputListener(listener)
    {
        this.inputListeners.splice(this.inputListeners.indexOf(listener), 1);
    }

    dispatchInput(inputKey, inputEvent, inputValue, ...args)
    {
        for(const inputListener of this.inputListeners)
        {
            inputListener.call(null, this, inputKey, inputEvent, inputValue, ...args);
        }
    }
}

export default InputDevice;