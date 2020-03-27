export class InputScheme
{
    constructor()
    {
        this._mapping = new Map();
    }

    add(inputName, scheme)
    {
        this._mapping.set(inputName, scheme);
        return this;
    }

    remove(inputName)
    {
        this._mapping.delete(inputName, scheme);
        return this;
    }

    update(inputName, scheme)
    {
        this._mapping.set(inputName, scheme);
        return this;
    }
}
