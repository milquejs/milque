import { InputDevice, InputType, InputEventCode } from './InputDevice.js';

/**
 * A class that listens to the keyboard events from the event target and
 * transforms the events into a valid {@link InputEvent} for the added
 * listeners.
 */
export class Keyboard extends InputDevice
{
    /**
     * Constructs a listening keyboard with no listeners (yet).
     * 
     * @param {EventTarget} eventTarget 
     * @param {Object} [opts] Any additional options.
     * @param {Boolean} [opts.repeat=false] Whether to accept repeated key
     * events.
     */
    constructor(eventTarget, opts = {})
    {
        super('Keyboard', eventTarget);

        const { repeat = false } = opts;
        this.repeat = repeat;

        /** @private */
        this._eventObject = {
            target: eventTarget,
            deviceName: this.deviceName,
            keyCode: '',
            event: InputEventCode.NULL,
            type: InputType.KEY,
            // Key values
            value: 0,
            control: false,
            shift: false,
            alt: false,
        };

        /** @private */
        this.onKeyDown = this.onKeyDown.bind(this);
        /** @private */
        this.onKeyUp = this.onKeyUp.bind(this);

        eventTarget.addEventListener('keydown', this.onKeyDown);
        eventTarget.addEventListener('keyup', this.onKeyUp);
    }

    /** @override */
    destroy()
    {
        let eventTarget = this.eventTarget;
        eventTarget.removeEventListener('keydown', this.onKeyDown);
        eventTarget.removeEventListener('keyup', this.onKeyUp);

        super.destroy();
    }

    /**
     * @private
     * @param {KeyboardEvent} e
     */
    onKeyDown(e)
    {
        if (e.repeat)
        {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }

        let event = this._eventObject;
        // We care more about location (code) than print char (key).
        event.keyCode = e.code;
        event.event = InputEventCode.DOWN;
        event.value = 1;
        event.control = e.ctrlKey;
        event.shift = e.shiftKey;
        event.alt = e.altKey;

        let result = this.dispatchInput(event);
        if (result)
        {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
    }

    /**
     * @private
     * @param {KeyboardEvent} e
     */
    onKeyUp(e)
    {
        let event = this._eventObject;
        // We care more about location (code) than print char (key).
        event.keyCode = e.code;
        event.event = InputEventCode.UP;
        event.value = 1;
        event.control = e.ctrlKey;
        event.shift = e.shiftKey;
        event.alt = e.altKey;

        let result = this.dispatchInput(event);
        if (result)
        {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
    }
}
