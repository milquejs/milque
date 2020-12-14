import { InputDevice, InputType, InputEventCode } from './InputDevice.js';

/**
 * Available Key Codes:
 * - PosX
 * - PosY
 * - WheelX
 * - WheelY
 * - WheelZ
 * - Button0 (left button)
 * - Button1 (middle button)
 * - Button2 (right button)
 * - Button3 (next button)
 * - Button4 (back button)
 */

const DEFAULT_LINE_PIXELS = 10;
const DEFAULT_PAGE_PIXELS = 100;

/**
 * A class that listens to the keyboard events from the event target and
 * transforms the events into a valid {@link InputEvent} for the added
 * listeners.
 */
export class Mouse extends InputDevice
{
    /**
     * Constructs a listening mouse with no listeners (yet).
     * 
     * @param {EventTarget} eventTarget
     * @param {Object} [opts] Any additional options.
     * @param {Boolean} [opts.eventsOnFocus=true] Whether to capture events only when it has focus.
     */
    constructor(eventTarget, opts = { eventsOnFocus: true })
    {
        super('Mouse', eventTarget);

        this.canvasTarget = (eventTarget instanceof HTMLCanvasElement && eventTarget)
            || eventTarget.canvas
            || eventTarget.querySelector('canvas')
            || (eventTarget.shadowRoot && eventTarget.shadowRoot.querySelector('canvas'))
            || eventTarget;
        this.eventsOnFocus = opts.eventsOnFocus;
        this._downHasFocus = false;

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
        this._positionObject = {
            target: eventTarget,
            deviceName: this.deviceName,
            keyCode: 'Position',
            event: InputEventCode.MOVE,
            type: InputType.POS,
            // Pos values
            x: 0, y: 0,
            dx: 0, dy: 0,
        };
        /** @private */
        this._wheelObject = {
            target: eventTarget,
            deviceName: this.deviceName,
            keyCode: 'Wheel',
            event: InputEventCode.MOVE,
            type: InputType.WHEEL,
            // Wheel values
            dx: 0, dy: 0, dz: 0,
        };

        /** @private */
        this.onMouseDown = this.onMouseDown.bind(this);
        /** @private */
        this.onMouseUp = this.onMouseUp.bind(this);
        /** @private */
        this.onMouseMove = this.onMouseMove.bind(this);
        /** @private */
        this.onContextMenu = this.onContextMenu.bind(this);
        /** @private */
        this.onWheel = this.onWheel.bind(this);

        eventTarget.addEventListener('mousedown', this.onMouseDown);
        eventTarget.addEventListener('contextmenu', this.onContextMenu);
        eventTarget.addEventListener('wheel', this.onWheel);
        eventTarget.addEventListener('mousemove', this.onMouseMove);
        document.addEventListener('mouseup', this.onMouseUp);
    }

    /** @override */
    destroy()
    {
        let eventTarget = this.eventTarget;
        eventTarget.removeEventListener('mousedown', this.onMouseDown);
        eventTarget.removeEventListener('contextmenu', this.onContextMenu);
        eventTarget.removeEventListener('wheel', this.onWheel);
        eventTarget.removeEventListener('mousemove', this.onMouseMove);
        document.removeEventListener('mouseup', this.onMouseUp);

        super.destroy();
    }

    setPointerLock(force = true)
    {
        if (force)
        {
            this.eventTarget.requestPointerLock();
        }
        else
        {
            this.eventTarget.exitPointerLock();
        }
    }

    hasPointerLock()
    {
        return document.pointerLockElement === this.eventTarget;
    }

    /**
     * @private
     * @param {MouseEvent} e
     */
    onMouseDown(e)
    {
        this._downHasFocus = true;
        
        let event = this._eventObject;
        // We care more about location (code) than print char (key).
        event.keyCode = 'Button' + e.button;
        event.event = InputEventCode.DOWN;
        event.value = 1;
        event.control = e.ctrlKey;
        event.shift = e.shiftKey;
        event.alt = e.altKey;

        let result = this.dispatchInput(event);
        if (result)
        {
            // Make sure it has focus first.
            if (document.activeElement === this.eventTarget)
            {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }
        }
    }

    /**
     * @private
     * @param {MouseEvent} e
     */
    onContextMenu(e)
    {
        e.preventDefault();
        e.stopPropagation();
        return false;
    }

    /**
     * @private
     * @param {WheelEvent} e
     */
    onWheel(e)
    {
        let event = this._wheelObject;
        switch(e.deltaMode)
        {
            case WheelEvent.DOM_DELTA_LINE:
                event.dx = e.deltaX * DEFAULT_LINE_PIXELS;
                event.dy = e.deltaY * DEFAULT_LINE_PIXELS;
                event.dz = e.deltaZ * DEFAULT_LINE_PIXELS;
                break;
            case WheelEvent.DOM_DELTA_PAGE:
                event.dx = e.deltaX * DEFAULT_PAGE_PIXELS;
                event.dy = e.deltaY * DEFAULT_PAGE_PIXELS;
                event.dz = e.deltaZ * DEFAULT_PAGE_PIXELS;
                break;
            case WheelEvent.DOM_DELTA_PIXEL:
            default:
                event.dx = e.deltaX;
                event.dy = e.deltaY;
                event.dz = e.deltaZ;
                break;
        }

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
     * @param {MouseEvent} e
     */
    onMouseUp(e)
    {
        // Make sure mouse down was pressed before this (with focus).
        if (!this._downHasFocus) return;
        this._downHasFocus = false;

        let event = this._eventObject;
        // We care more about location (code) than print char (key).
        event.keyCode = 'Button' + e.button;
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

    /**
     * @private
     * @param {MouseEvent} e
     */
    onMouseMove(e)
    {
        if (this.eventsOnFocus && document.activeElement !== this.eventTarget) return;

        const element = this.canvasTarget;
        const { clientWidth, clientHeight } = element;
        const rect = element.getBoundingClientRect();
    
        let dx = e.movementX / clientWidth;
        let dy = e.movementY / clientHeight;
        let x = (e.clientX - rect.left) / clientWidth;
        let y = (e.clientY - rect.top) / clientHeight;
    
        let event = this._positionObject;
        event.x = x;
        event.y = y;
        event.dx = dx;
        event.dy = dy;

        this.dispatchInput(event);
    }
}
