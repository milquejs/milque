import Input from './Input.js';

class ActionInput extends Input
{
    constructor(name, ...eventKeys)
    {
        super(name, ...eventKeys);
    }

    /** @override */
    update(source, key, event, value)
    {
        if (typeof value !== 'boolean')
        {
            value = Boolean(value);
        }
        return value;
    }
}

export default ActionInput;
