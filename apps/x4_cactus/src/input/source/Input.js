export class Input
{
    constructor()
    {
        /** The current state of the input. */
        this.value = 0;
    }

    update(value) { this.value = value; }
    poll() { this.value = 0; }

    /**
     * @param {import('../device/InputDevice.js').InputEventCode} eventCode
     * @returns {Number} The event state.
     */
    getEvent(eventCode) { return 0; }
    getState() { return this.value; }
}
