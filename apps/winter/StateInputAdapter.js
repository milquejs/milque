export class StateInputAdapter
{
    setParameters(params)
    {
        return this;
    }

    handleEvent(source, key, event, value)
    {
        return { value: false, consumed: false };
    }
}
