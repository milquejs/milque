class ComponentManager
{
    static getComponentName(component)
    {
        if (typeof component === 'string')
        {
            return component;
        }
        else
        {
            return component.name;
        }
    }

    constructor(componentFactory)
    {
        this.components = new Map();
        this.factory = componentFactory;
    }

    /**
     * Creates a component for the entity. Assumes component has not yet
     * been assigned for the entity.
     * @param {Number} entity The id of the entity to add.
     * @param  {...any} args Create arguments passed to the component handler.
     * @returns {Object} The added component instance.
     */
    add(entity, ...args)
    {
        const dst = this.factory.create(...args);
        this.components.set(entity, dst);
        return dst;
    }

    /**
     * Changes the component for the entity. Assumes component has already
     * been assigned to the entity.
     * @param {Number} entity The id of the entity to change for.
     * @param  {...any} args Change arguments passed to the component handler.
     * @returns {Object} The changed component instance.
     */
    change(entity, ...args)
    {
        // Due to assumption, this will NEVER be null.
        const component = this.components.get(entity);
        this.factory.change(component, ...args);
        return component;
    }

    /**
     * Removes the component for the entity. Assumes component has already
     * been assigned and not yet removed from the entity.
     * @param {Number} entity The id of the entity to remove.
     */
    remove(entity)
    {
        // Due to assumption, this will NEVER be null.
        const component = this.components.get(entity);
        this.factory.destroy(component);

        // Remove it from the entity.
        this.components.delete(entity);
    }

    /**
     * Gets the component instance assigned to the entity.
     * @param {Number} entity The id of the entity to get.
     * @returns {Object} The component instance for the entity.
     */
    get(entity)
    {
        return this.components.get(entity);
    }

    /**
     * Checks whether the component exists for the entity.
     * @param {Number} entity The id of the entity to check for.
     * @returns {Boolean} Whether the entity has the component.
     */
    has(entity)
    {
        return this.components.has(entity);
    }

    /**
     * Removes all component instances.
     */
    clear()
    {
        this.components.clear();
    }
}

export default ComponentManager;
