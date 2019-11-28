class Input
{
    constructor(name, ...eventKeys)
    {
        this.name = name;
        this.eventKeys = eventKeys;
    }

    update(source, key, event, value, ...args)
    {
        return value;
    }
}

export default Input;