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

    addComponent(componentClass, initialValues = undefined)
    {
        this.world.addComponent(this.id, componentClass, initialValues);
        return this;
    }

    removeComponent(componentClass)
    {
        this.world.removeComponent(this.id, componentClass);
        return this;
    }

    hasComponent(componentClass)
    {
        return this.world.hasComponent(this.id, componentClass);
    }

    getComponent(componentClass)
    {
        return this.world.getComponent(this.id, componentClass);
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
