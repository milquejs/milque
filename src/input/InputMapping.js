/**
 * A map of event keys to inputs. This is the bridge between raw input events to custom inputs.
 */
class InputMapping
{
    constructor()
    {
        this.inputs = new Map();
    }

    clear()
    {
        this.inputs.clear();
    }

    register(input)
    {
        for(const eventKey of input.eventKeys)
        {
            if (this.inputs.has(eventKey))
            {
                this.inputs.get(eventKey).push(input);
            }
            else
            {
                this.inputs.set(eventKey, [input]);
            }
        }
    }

    unregister(input)
    {
        for(const eventKey of input.eventKeys)
        {
            if (this.inputs.has(eventKey))
            {
                const inputs = this.inputs.get(eventKey);
                const index = inputs.indexOf(input);
                if (index >= 0)
                {
                    inputs.splice(index, 1);
                }
            }
        }
    }

    get(eventKey)
    {
        if (this.inputs.has(eventKey))
        {
            return this.inputs.get(eventKey);
        }
        else
        {
            return [];
        }
    }

    values()
    {
        return this.inputs.values();
    }

    static toEventKey(sourceName, key, event = undefined)
    {
        return sourceName + '[' + key + ']' + (event ? ':' + event : '');
    }

    static fromEventKey(inputEventKey, dst = [])
    {
        const sourceEnd = inputEventKey.indexOf('[');
        if (sourceEnd >= 0)
        {
            const sourceName = inputEventKey.substring(0, sourceEnd).trim();
            dst.push(sourceName);
            const keyEnd = inputEventKey.indexOf(']', sourceEnd + 1);
            if (keyEnd >= 0)
            {
                const keyName = inputEventKey.substring(sourceEnd + 1, keyEnd).trim();
                dst.push(keyName);
                const eventBegin = inputEventKey.indexOf(':', keyEnd + 1);
                if (eventBegin >= 0)
                {
                    const eventName = inputEventKey.substring(eventBegin + 1).trim();
                    dst.push(eventName);
                }
            }
            else
            {
                throw new Error('Invalid format - missing closing bracket for key.');
            }
        }
        else
        {
            dst.push(inputEventKey.trim());
        }
        return dst;
    }
}

export default InputMapping;