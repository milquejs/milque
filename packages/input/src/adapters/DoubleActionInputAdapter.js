import { ActionInputAdapter } from './ActionInputAdapter.js';

export let DOUBLE_ACTION_TIME = 300;

export class DoubleActionInputAdapter extends ActionInputAdapter
{
    constructor(eventKeyStrings)
    {
        super(eventKeyStrings);

        this.actionTime = 0;
    }

    /** @override */
    update(eventKey, value = true)
    {
        let currentTime = Date.now();
        for(let targetEventKey of this.eventKeys)
        {
            if (targetEventKey.matches(eventKey))
            {
                if (value)
                {
                    if (currentTime - this.actionTime <= DOUBLE_ACTION_TIME)
                    {
                        this.actionTime = 0;
                        this.next = true;
                        return true;
                    }
                    else
                    {
                        this.actionTime = currentTime;
                        return false;
                    }
                }
                else
                {
                    this.next = false;
                    return true;
                }
            }
        }
        return false;
    }
}
