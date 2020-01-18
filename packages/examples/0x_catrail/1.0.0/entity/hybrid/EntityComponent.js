/** Cannot be directly added through world.addComponent(). Must be create with new EntityComponent(). */
export class EntityComponent
{
    constructor(world, entityId = undefined)
    {
        if (typeof entityId !== 'undefined')
        {
            throw new Error('This component cannot be added to an existing entity; it can only initialize itself.');
        }

        const id = world.createEntity();

        // Skip component creation, as we will be using ourselves :D
        world.componentManager.putComponent(id, EntityComponent, this, undefined);

        this.world = world;
        this.id = id;
    }

    /** @override */
    copy(values) { throw new Error('Unsupported operation; cannot be initialized by existing values.'); }
    
    /** @override */
    reset() { return false; }

    destroy()
    {
        this.world.destroyEntity(this.entityId);
        this.world = null;
    }

    addComponent(componentType, initialValues = undefined)
    {
        this.world.addComponent(this.id, componentType, initialValues);
        return this;
    }

    removeComponent(componentType)
    {
        this.world.removeComponent(this.id, componentType);
        return this;
    }

    hasComponent(componentType)
    {
        return this.world.hasComponent(this.id, componentType);
    }

    getComponent(componentType)
    {
        return this.world.getComponent(this.id, componentType);
    }
}

export function getEntityById(world, entityId)
{
    return world,getComponent(entityId, EntityComponent);
}

export function getEntities(world)
{
    let dst = [];
    let entityIds = world.query([EntityComponent]);
    for(let entityId of entityIds)
    {
        let component = world.getComponent(entityId, EntityComponent);
        dst.push(component);
    }
    return dst;
}
