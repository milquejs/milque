export class EntityManager
{
    constructor(world)
    {
        this._world = world;
        this._entities = new Set();
        this._nextAvailableEntityId = 1;
    }

    addEntityId(entityId)
    {
        this._entities.add(entityId);
        this._world.emit('entitycreate', entityId);
    }

    deleteEntityId(entityId)
    {
        this._entities.delete(entityId);
        this._world.emit('entitydestroy', entityId);
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
