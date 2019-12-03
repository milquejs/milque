/**
 * @version 1.1
 */
const EventableInstance = {
    on(event, callback, handle = callback)
    {
        let callbacks;
        if (!this.__events.has(event))
        {
            callbacks = new Map();
            this.__events.set(event, callbacks);
        }
        else
        {
            callbacks = this.__events.get(event);
        }

        if (!callbacks.has(handle))
        {
            callbacks.set(handle, callback);
        }
        else
        {
            throw new Error(`Found callback for event '${event}' with the same handle '${handle}'.`);
        }
        return this;
    },
    off(event, handle)
    {
        if (this.__events.has(event))
        {
            const callbacks = this.__events.get(event);
            if (callbacks.has(handle))
            {
                callbacks.delete(handle);
            }
            else
            {
                throw new Error(`Unable to find callback for event '${event}' with handle '${handle}'.`);
            }
        }
        else
        {
            throw new Error(`Unable to find event '${event}'.`);
        }
        return this;
    },
    once(event, callback, handle = callback)
    {
        const func = (...args) => {
            this.off(event, handle);
            callback.apply(this, args);
        };
        return this.on(event, func, handle);
    },
    emit(event, ...args)
    {
        if (this.__events.has(event))
        {
            const callbacks = Array.from(this.__events.get(event).values());
            for(const callback of callbacks)
            {
                callback.apply(this, args);
            }
        }
        else
        {
            this.__events.set(event, new Map());
        }
        return this;
    }
};

const Eventable = {
    create()
    {
        const result = Object.create(EventableInstance);
        result.__events = new Map();
        return result;
    },
    assign(dst)
    {
        const result = Object.assign(dst, EventableInstance);
        result.__events = new Map();
        return result;
    },
    mixin(targetClass)
    {
        const targetPrototype = targetClass.prototype;
        Object.assign(targetPrototype, EventableInstance);
        targetPrototype.__events = new Map();
    }
};

export default Eventable;
