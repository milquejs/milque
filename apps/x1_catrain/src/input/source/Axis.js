import { InputEventCode } from '../device/InputDevice.js';
import { Input } from './Input.js';

export class Axis extends Input
{
    constructor()
    {
        super();

        this.delta = 0;

        /** @private */
        this.next = {
            delta: 0,
        };
    }

    /** @override */
    update(value, delta)
    {
        this.value = value;
        this.next.delta += delta;
    }

    /** @override */
    poll()
    {
        this.delta = this.next.delta;
        this.next.delta = 0;
    }

    /** @override */
    getEvent(eventCode)
    {
        switch(eventCode)
        {
            case InputEventCode.MOVE: return this.delta;
            default: return super.getEvent(eventCode);
        }
    }
}
