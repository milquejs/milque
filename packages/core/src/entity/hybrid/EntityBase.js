import { EntityComponent } from './EntityComponent.js';

export class EntityBase extends EntityComponent
{
    constructor(world)
    {
        super(world);

        this.world = world;
    }

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
