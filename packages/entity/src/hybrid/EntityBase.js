import { EntityComponent } from './EntityComponent.js';

export class EntityBase extends EntityComponent
{
    constructor(entityManager)
    {
        super(entityManager);

        this.entityManager = entityManager;
    }

    destroy()
    {
        this.entityManager.destroyEntity(this.id);
    }

    addComponent(componentType, initialValues = undefined)
    {
        this.entityManager.addComponent(this.id, componentType, initialValues);
        return this;
    }

    addTagComponent(componentType)
    {
        this.entityManager.addTagComponent(this.id, componentType);
        return this;
    }

    removeComponent(componentType)
    {
        this.entityManager.removeComponent(this.id, componentType);
        return this;
    }

    hasComponent(componentType)
    {
        return this.entityManager.hasComponent(this.id, componentType);
    }

    getComponent(componentType)
    {
        return this.entityManager.getComponent(this.id, componentType);
    }
}
