export class InputDevice extends EventTarget
{
    constructor()
    {
        super();
        this.listeners = {};
    }

    /** @override */
    addEventListener(type, listener)
    {
        // NOTE: As defined by the web standard.
        let listeners = type in this.listeners
            ? this.listeners[type]
            : this.listeners[type] = new Set();
        listeners.add(listener);
    }

    /** @override */
    removeEventListener(type, listener)
    {
        // NOTE: As defined by the web standard.
        if (type in this.listeners)
        {
            listeners[type].delete(listener);
        }
    }

    /** @override */
    dispatchEvent(event)
    {
        // HACK: Although not standard, this is a simpler interface.
        // Anything other than undefined returned is treated as a
        // preventDefault() call.
        if (event.type in this.listeners)
        {
            let listeners = this.listeners[event.type];
            let defaultPrevented = false;
            for(let listener of listeners)
            {
                let result = listener.call(undefined, event);
                if (typeof result !== 'undefined') defaultPrevented = true;
            }
            return !defaultPrevented;
        }
        return true;
    }
}
