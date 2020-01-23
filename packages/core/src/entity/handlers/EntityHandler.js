/**
 * @fires destroy
 */
export class EntityHandler
{
    constructor()
    {
        this._entities = new Set();
        this._nextAvailableEntityId = 1;
        this._listeners = new Map();
    }

    /**
     * Adds a listener for entity events that occur for the passed-in id.
     * 
     * @param {EntityId} entityId The associated id for the entity to listen to.
     * @param {String} eventType The event type to listen for.
     * @param {Function} listener The listener function that will be called when the event occurs.
     * @param {Object} [opts] Additional options.
     * @param {Boolean} [opts.once=false] Whether the listener should be invoked at most once after being
     * added. If true, the listener would be automatically removed when invoked.
     * @param {Function|String|*} [opts.handle=listener] The handle to uniquely identify the listener. If set,
     * this will be used instead of the function instance. This is usful for anonymous functions, since
     * they are always unique and therefore cannot be removed, causing an unfortunate memory leak.
     */
    addEntityListener(entityId, eventType, listener, opts = undefined)
    {
        const handle = opts && typeof opts.handle !== 'undefined' ? opts.handle : listener;
        
        if (this._listeners.has(entityId))
        {
            let eventMap = this._listeners.get(entityId);
            if (eventType in eventMap)
            {
                let listeners = eventMap[eventType];
                listeners.set(handle, listener);
            }
            else
            {
                let listeners = new Map();
                listeners.set(handle, listener);
                eventMap[eventType] = listeners;
            }
        }
        else
        {
            let onces = new Set();
            let listeners = new Map();
            listeners.set(handle, listener);
            if (opts.once) onces.add(handle);
            let eventMap = {
                onces,
                [eventType]: listeners
            };
            this._listeners.set(entityId, eventMap);
        }
    }

    /**
     * Removes the listener from the entity with the passed-in id.
     * 
     * @param {EntityId} entityId The associated id for the entity to remove from.
     * @param {String} eventType The event type to remove from.
     * @param {Function|String|*} handle The listener handle that will be called when the event occurs.
     * Usually, this is the function itself.
     * @param {Object} [opts] Additional options.
     */
    removeEntityListener(entityId, eventType, handle, opts = undefined)
    {
        if (this._listeners.has(entityId))
        {
            let eventMap = this._listeners.get(entityId);
            if (eventType in eventMap)
            {
                eventMap[eventType].delete(handle);
                if (eventMap.onces.has(handle))
                {
                    eventMap.onces.delete(handle);
                }
            }
        }
    }

    /**
     * Dispatches an event to all the entity's listeners.
     * 
     * @param {EntityId} entityId The id of the entity.
     * @param {String} eventType The type of the dispatched event.
     * @param {Array} [eventArgs] An array of arguments to be passed to the listeners.
     */
    dispatchEntityEvent(entityId, eventType, eventArgs = undefined)
    {
        if (this._listeners.has(entityId))
        {
            let eventMap = this._listeners.get(entityId);
            if (eventType in eventMap)
            {
                let onces = eventMap.onces;
                let listeners = eventMap[eventType];
                for(let [handle, listener] of listeners.entries())
                {
                    listener.apply(undefined, eventArgs);
                    if (onces.has(handle))
                    {
                        listeners.delete(handle);
                    }
                }
            }
        }
    }

    addEntityId(entityId)
    {
        this._entities.add(entityId);
    }

    deleteEntityId(entityId)
    {
        this._entities.delete(entityId);
        this.dispatchEntityEvent(entityId, 'destroy', [ entityId ]);
    }
    
    getNextAvailableEntityId()
    {
        return this._nextAvailableEntityId++;
    }

    getEntityIds()
    {
        return this._entities;
    }
}
