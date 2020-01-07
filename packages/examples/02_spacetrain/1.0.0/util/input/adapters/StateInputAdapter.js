import { AbstractInputAdapter } from './AbstractInputAdapter.js';
import { EventKey } from '../EventKey.js';

export class StateInputAdapter extends AbstractInputAdapter
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
