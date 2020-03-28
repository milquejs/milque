import { InputScheme } from "./InputScheme";

export class InputSchemeBuilder
{
    constructor()
    {
        this._inputMapping = {};
        this._devices = [];
    }

    input(input, adapter)
    {
        this._inputMapping[input] = adapter;
        return this;
    }

    device(device)
    {
        this._devices.push(device);
        return this;
    }

    build()
    {
        return new InputScheme(this._inputMapping, this._devices);
    }
}
