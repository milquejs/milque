import { AbstractInput } from './AbstractInput.js';
import { EventKey } from './EventKey.js';

export class ActionInput extends AbstractInput
{
    constructor(eventKeyStrings)
    {
        super(false);

        this.eventKeys = [];
        for(let eventKeyString of eventKeyStrings)
        {
            this.eventKeys.push(EventKey.parse(eventKeyString));
        }

        console.log(this.eventKeys);
    }

    /** @override */
    consume() { return false; }

    /** @override */
    update(eventKey, value = true)
    {
        if (super.update(eventKey, value)) return true;
        for(let targetEventKey of this.eventKeys)
        {
            if (targetEventKey.matches(eventKey))
            {
                this.next = value;
                return true;
            }
        }
        return false;
    }
}
