import { AbstractInput } from './AbstractInput.js';
import { EventKey } from './EventKey.js';

export class ActionInput extends AbstractInput
{
    constructor(eventKeyString)
    {
        super(false);

        this.eventKey = EventKey.parse(eventKeyString);
    }

    /** @override */
    consume() { return false; }

    /** @override */
    update(eventKey, value = true)
    {
        if (super.update(eventKey, value)) return true;
        if (this.eventKey.matches(eventKey))
        {
            this.next = value;
            return true;
        }
        return false;
    }
}
