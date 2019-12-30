import { AbstractInput } from './AbstractInput.js';

export class ActionInput extends AbstractInput
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
