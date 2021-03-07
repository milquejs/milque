/**
 * @typedef {import('../device/InputDevice.js').InputEventCode} InputEventCode
 */

/**
 * A class to represent the basic input interface.
 */
export class Input
{
    constructor()
    {
        /** The current state of the input. */
        this.value = 0;
        /** The previous state (after poll) of the input. */
        this.prev = 0;

        // TODO: Do we need a next? How do you tell if the update is a PRESS vs a HOLD?
    }

    update(value)
    {
        this.value = value;
    }

    poll()
    {
        this.prev = this.value;
        this.value = 0;
    }

    /**
     * @param {InputEventCode} eventCode
     * @returns {number} The event state.
     */
    getEvent(eventCode) { return 0; }

    getState() { return this.value; }
    getPrevState() { return this.prev; }
}
