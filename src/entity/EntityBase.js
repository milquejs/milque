import ComponentBase from './component/ComponentBase.js';

class EntityBase extends ComponentBase
{
    constructor()
    {
        super();
        this.entityManager = null;
        this.entityID = -1;
    }

    /**
     * @override
     * @param {EntityManager} entityManager The entity manager that owns this entity.
     * @param {Number} entityID The id of the represented entity.
     */
    create(entityManager, entityID, ...args)
    {
        this.entityManager = entityManager;
        this.entityID = entityID;
        this.onCreate(...args);
        return this;
    }

    /** @override */
    update(...args)
    {
        this.onUpdate(...args);
        return this;
    }

    /**
     * @override
     * @returns {Boolean} True if instance can be cached and re-used.
     */
    destroy()
    {
        const result = this.onDestroy();
        this.entityManager.destroy(this.entityID);
        this.entityID = -1;
        return result;
    }

    component(component, ...args)
    {
        if (this.entityManager.has(this.entityID, component))
        {
            this.entityManager.update(this.entityID, component, ...args);
        }
        else
        {
            const instance = this.entityManager.assign(this.entityID, component, ...args);
            for(const key of Object.keys(instance))
            {
                const propDescriptor = Object.getOwnPropertyDescriptor(this, key);
                // Initialize property if already defined.
                if (propDescriptor.value) instance[key] = value;

                Object.defineProperty(this, key, {
                    get() { return instance[key]; },
                    set(value) { instance[key] = value; },
                    enumerable: true
                });
            }
        }

        return this;
    }

    tag(tag, enabled=true)
    {
        if (enabled)
        {
            this.entityManager.assign(this.entityID, tag);
        }
        else
        {
            this.entityManager.remove(this.entityID, tag);
        }
        return this;
    }

    remove(...components)
    {
        for(const component of components)
        {
            const instance = this.entityManager.get(this.entityID, component);
            for(const key of Object.keys(instance))
            {
                delete this[key];
            }
        }
        this.entityManager.remove(this.entityID, ...components);
        return this;
    }

    has(...components)
    {
        return this.entityManager.has(this.entityID, ...components);
    }

    get(component, ...components)
    {
        return this.entityManager.get(this.entityID, component, ...components);
    }

    onCreate(...args) {}
    onUpdate(...args) {}
    onDestroy() { return false; }
}

export default EntityBase;