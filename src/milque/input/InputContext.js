import InputMapping from './InputMapping.js';

class InputContext
{
    constructor(name)
    {
        this.name = name;
        this.disabled = false;

        this.mapping = new InputMapping();
    }

    enable()
    {
        this.disabled = true;
        return this;
    }

    disable()
    {
        this.disabled = true;
        return this;
    }
}

export default InputContext;