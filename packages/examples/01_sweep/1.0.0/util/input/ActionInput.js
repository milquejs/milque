import { BaseInput } from './BaseInput.js';

export class ActionInput extends BaseInput
{
    constructor(eventKeyString)
    {
        super(false);

        this.eventKey = eventKeyString;
    }

    /** @override */
    consume() { return false; }

    /** @override */
    update(eventKey, value = true)
    {
        if (eventKey === this.eventKey)
        {
            this.next = value;
        }
    }
}
