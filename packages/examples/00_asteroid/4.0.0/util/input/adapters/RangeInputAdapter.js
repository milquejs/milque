import { AbstractInputAdapter } from './AbstractInputAdapter.js';
import { EventKey } from '../EventKey.js';

export class RangeInputAdapter extends AbstractInputAdapter
{
    constructor(eventKeyString)
    {
        super(0);

        this.eventKey = EventKey.parse(eventKeyString);
    }

    /** @override */
    consume()
    {
        switch(this.eventKey.string)
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
        if (super.update(eventKey, value)) return true;
        if (this.eventKey.matches(eventKey))
        {
            this.next = value;
            return true;
        }
        return false;
    }
}
