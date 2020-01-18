import { Eventable } from '../milque.js';

/**
 * @fires create
 * @fires destroy
 */
export class EntityManager
{
    constructor()
    {
        this._entities = new Set();
        this._nextAvailableEntityId = 1;
    }

    addEntityId(entityId)
    {
        this._entities.add(entityId);
        this.emit('create', entityId);
    }

    deleteEntityId(entityId)
    {
        this._entities.delete(entityId);
        this.emit('destroy', entityId);
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
Eventable.mixin(EntityManager);
