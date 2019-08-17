class ComponentManager
{
    constructor(componentFactory)
    {
        this.components = new Map();
        this.factory = componentFactory;
    }

    add(entity, ...args)
    {
        const dst = this.factory.create(...args);
        this.components.set(entity, dst);
        return dst;
    }

    remove(entity)
    {
        if (this.components.has(entity))
        {
            const component = this.components.get(entity);
            this.factory.destroy(component);

            // Remove it from the entity.
            this.components.delete(entity);
        }
    }

    get(entity)
    {
        return this.components.get(entity);
    }

    has(entity)
    {
        return this.components.has(entity);
    }

    clear()
    {
        this.components.clear();
    }
}

export default ComponentManager;
