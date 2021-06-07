import { InputEventCode } from '../device/InputDevice.js';
import { Input } from './Input.js';

/**
 * A stateful input for axis input interfaces, such as mouse positions,
 * scrolling, joysticks, etc. The unscaled `value` is a floating point
 * in a 1-dimensional range of [-1, 1]. It also keeps track of the
 * accumulated delta since last poll with `delta`.
 */
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
        // Update previous state.
        this.prev = this.value;

        // Update current state.
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
