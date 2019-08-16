class InputState
{
    constructor()
    {
        this.actions = new Set();
        this.states = new Set();
        this.ranges = new Map();
    }

    clear()
    {
        this.actions.clear();
        this.ranges.clear();
        this.states.clear();
    }

    setAction(name, value = true)
    {
        if (value)
        {
            this.actions.add(name);
        }
        else
        {
            this.actions.delete(name);
        }
        return this;
    }

    setState(name, value = true)
    {
        if (value)
        {
            this.states.add(name);
        }
        else
        {
            this.states.delete(name);
        }
        return this;
    }

    setRange(name, value = undefined)
    {
        if (typeof value === 'undefined')
        {
            this.ranges.delete(name);
        }
        else
        {
            this.ranges.set(name, value);
        }
        return this;
    }

    getAction(name, consume = true)
    {
        if (this.actions.has(name))
        {
            if (consume)
            {
                this.actions.delete(name);
            }

            return true;
        }
        else
        {
            return false;
        }
    }

    getState(name, consume = true)
    {
        if (this.states.has(name))
        {
            if (consume)
            {
                this.states.delete(name);
            }

            return true;
        }
        else
        {
            return false;
        }
    }

    getRange(name, consume = true)
    {
        if (this.ranges.has(name))
        {
            const result = this.ranges.get(name);
            if (consume)
            {
                this.ranges.delete(name);
            }
            return result;
        }
        else
        {
            return 0;
        }
    }

    hasAction(name)
    {
        return this.actions.has(name);
    }

    hasState(name)
    {
        return this.states.has(name);
    }

    hasRange(name)
    {
        return this.ranges.has(name);
    }
}

export default InputState;