export class InputDevice
{
    /** @abstract */
    static addInputEventListener(elementTarget, listener) {}
    
    /** @abstract */
    static removeInputEventListener(elementTarget, listener) {}

    constructor(eventTarget)
    {
        this.eventTarget = eventTarget;
    }
}

export class Button
{
    constructor()
    {
        this.down = 0;
        this.up = 0;
        this.value = 0;

        this.next = {
            up: 0,
            down: 0,
        };
    }

    update(event, value)
    {
        if (event === 'down')
        {
            this.next.down = value;
        }
        else
        {
            this.next.up = value;
        }
    }

    poll()
    {
        if (this.value)
        {
            if (this.up && !this.next.up)
            {
                this.value = 0;
            }
        }
        else if (this.next.down)
        {
            this.value = 1;
        }

        this.down = this.next.down;
        this.up = this.next.up;

        this.next.down = 0;
        this.next.up = 0;
    }

    /** @override */
    toString()
    {
        return this.value;
    }
}

export class Axis
{
    constructor()
    {
        this.value = 0;
    }

    update(event, value)
    {
        this.value = value;
    }

    poll() {}

    /** @override */
    toString()
    {
        return this.value;
    }
}

export class AggregatedAxis extends Axis
{
    constructor()
    {
        super();

        this.next = 0;
    }

    /** @override */
    update(event, value)
    {
        this.next += value;
    }

    /** @override */
    poll()
    {
        this.value = this.next;
        this.next = 0;
    }
}
