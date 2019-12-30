import { BaseInput } from './BaseInput.js';

export class RangeInput extends BaseInput
{
    constructor(eventKeyString)
    {
        super(0);

        this.eventKey = eventKeyString;
    }

    /** @override */
    consume()
    {
        switch(this.eventKey)
        {
            case 'mouse[pos].dx':
            case 'mouse[pos].dy':
                return 0;
            case 'mouse[pos].x':
            case 'mouse[pos].y':
            default:
                return this.next;
        }
    }

    /** @override */
    update(eventKey, value = 1)
    {
        if (eventKey === this.eventKey)
        {
            this.next = value;
        }
    }
}
