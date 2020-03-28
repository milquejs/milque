import { AbstractInput } from './AbstractInput.js';
import { EventKey } from './EventKey.js';

export class StateInput extends AbstractInput
{
    constructor(eventKeyMap)
    {
        super(0);
        
        this.eventKeyEntries = [];
        for(let eventKey of Object.keys(eventKeyMap))
        {
            this.eventKeyEntries.push({
                key: EventKey.parse(eventKey),
                value: eventKeyMap[eventKey]
            });
        }
    }

    /** @override */
    update(eventKey, value = true)
    {
        if (super.update(eventKey, value)) return true;
        if (value)
        {
            for(let eventKeyEntry of this.eventKeyEntries)
            {
                if (eventKeyEntry.key.matches(eventKey))
                {
                    this.next = eventKeyEntry.value;
                    return true;
                }
            }
        }
        return false;
    }
}
