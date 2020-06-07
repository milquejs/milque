export class InputDevice
{
    /** @abstract */
    static addInputEventListener(elementTarget, listener) {}
    
    /** @abstract */
    static removeInputEventListener(elementTarget, listener) {}

    constructor(eventTarget)
    {
        this.eventTarget = eventTarget;
    }
}
