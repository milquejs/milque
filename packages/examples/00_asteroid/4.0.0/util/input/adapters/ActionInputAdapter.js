import { AbstractInputAdapter } from './AbstractInputAdapter.js';
import { EventKey } from '../EventKey.js';

export class ActionInputAdapter extends AbstractInputAdapter
{
    constructor(eventKeyStrings)
    {
        super(false);

        this.eventKeys = [];
        for(let eventKeyString of eventKeyStrings)
        {
            this.eventKeys.push(EventKey.parse(eventKeyString));
        }
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
