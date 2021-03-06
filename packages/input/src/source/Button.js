import { InputEventCode } from '../device/InputDevice.js';
import { Input } from './Input.js';

export class Button extends Input
{
    constructor()
    {
        super();

        /** Whether the button is just pressed. Is updated on poll(). */
        this.down = false;
        /** Whether the button is just released. Is updated on poll(). */
        this.up = false;

        /** @private */
        this.next = {
            down: false,
            up: false,
        };
    }

    /** @override */
    update(value)
    {
        if (value)
        {
            this.next.down = true;
        }
        else
        {
            this.next.up = true;
        }
    }

    /** @override */
    poll()
    {
        // Update previous state.
        this.prev = this.value;

        // Poll current state.
        const { up: nextUp, down: nextDown } = this.next;
        if (this.value)
        {
            if (this.up && !nextUp)
            {
                this.value = 0;
            }
        }
        else if (nextDown)
        {
            this.value = 1;
        }

        this.down = nextDown;
        this.up = nextUp;

        this.next.down = false;
        this.next.up = false;
    }

    /** @override */
    getEvent(eventCode)
    {
        switch(eventCode)
        {
            case InputEventCode.DOWN: return (this.down & 1);
            case InputEventCode.UP: return (this.up & 1);
            default: return super.getEvent(eventCode);
        }
    }
}
