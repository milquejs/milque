export class EntityWrapperBase
{
    constructor(entityManager)
    {
        this.entityManager = entityManager;

        this.id = entityManager.createEntity();
    }

    add(componentType, initialValues = undefined)
    {
        this.entityManager.addComponent(this.id, componentType, initialValues);
        return this;
    }

    remove(componentType)
    {
        this.entityManager.removeComponent(this.id, componentType);
        return this;
    }

    has(...componentTypes)
    {
        return this.entityManager.hasComponent(this.id, ...componentTypes);
    }

    destroy()
    {
        this.entityManager.destroyEntity(this.id);
    }

    getEntityId() { return this.id; }
}

export function create(entityManager)
{
    return new EntityWrapperBase(entityManager);
}
