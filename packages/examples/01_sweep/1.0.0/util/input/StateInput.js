import { BaseInput } from './BaseInput.js';

export class StateInput extends BaseInput
{
    constructor(eventKeyMap)
    {
        super(0);

        this.eventKeys = eventKeyMap;
    }

    /** @override */
    update(eventKey, value = true)
    {
        if (eventKey in this.eventKeys && value)
        {
            this.next = this.eventKeys[eventKey];
        }
    }
}
