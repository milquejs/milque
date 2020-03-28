export class InputScheme
{
    constructor(inputMapping)
    {
        this._mapping = inputMapping;
    }

    changeInput(inputName, adapter)
    {
        this._mapping.set(inputName, adapter);
        return this;
    }
}
