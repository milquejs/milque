import ComponentBase from './ComponentBase.js';

class EntityBase extends ComponentBase
{
    constructor()
    {
        this.entityManager = null;
        this.id = -1;
    }

    /**
     * Creates an entity.
     * @param {EntityManager} entityManager The entity manager that owns this entity.
     * @param {Number} entityID The id of the represented entity.
     */
    create(entityManager, entityID, ...args)
    {
        this.entityManager = entityManager;
        this.id = entityID;
        this.onCreate(...args);
        return this;
    }

    /**
     * @returns {Boolean} True if instance can be cached and re-used.
     */
    destroy()
    {
        const result = this.onDestroy();
        this.entityManager.destroy(this.id);
        this.id = -1;
        return result;
    }

    assign(component, ...args)
    {
        this.entityManager.assign(this.id, component, ...args);
        return this;
    }

    remove(...components)
    {
        this.entityManager.remove(this.id, ...components);
        return this;
    }

    has(...components)
    {
        return this.entityManager.has(this.id, ...components);
    }

    get(component, ...components)
    {
        return this.entityManager.get(this.id, component, ...components);
    }

    onCreate(...args) {}

    onDestroy()
    {
        return false;
    }
}

export default EntityBase;