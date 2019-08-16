import Input from './Input.js';
import InputMapping from '../InputMapping.js';

class StateInput extends Input
{
    constructor(name, downEventKey, upEventKey)
    {
        super(name, downEventKey, upEventKey);

        this.active = false;
    }

    /** @override */
    update(source, key, event, value)
    {
        if (typeof value !== 'boolean')
        {
            value = Boolean(value);
        }

        const eventKey = InputMapping.toEventKey(source.name, key, event);
        if (eventKey === this.eventKeys[0])
        {
            this.active = value;
        }
        else if (eventKey === this.eventKeys[1])
        {
            this.active = !value;
        }
        else
        {
            return null;
        }

        return this.active;
    }
}

export default StateInput;
