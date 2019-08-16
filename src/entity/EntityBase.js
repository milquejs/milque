class EntityBase
{
    static get TAG() { return `#${this.name}`; }

    /**
     * Creates an entity.
     * @param {EntityManager} entityManager The entity manager that owns this entity.
     */
    constructor(entityManager)
    {
        this.entityManager = entityManager;
    }

    create()
    {
        const tags = findInheritedTags(this.constructor);
        this.id = this.entityManager.create(...tags);
        this.onCreate();
        return this;
    }

    /**
     * @returns {Boolean} True if instance can be cached and re-used.
     */
    destroy()
    {
        this.entityManager.destroy(this.id);
        this.id = -1;
        return this.onDestroy();
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

    onCreate() {}

    onDestroy()
    {
        return false;
    }
}

function findInheritedTags(Class, dst=[])
{
    if (Class.hasOwnProperty('INHERITED_TAGS'))
    {
        for(const tag of Class.INHERITED_TAGS)
        {
            dst.push(tag);
        }
    }
    else if (Class.hasOwnProperty('TAG'))
    {
        dst.push(Class.TAG);

        const superClass = Object.getPrototypeOf(Class);
        if (superClass)
        {
            for(const tag of findInheritedTags(superClass))
            {
                dst.push(tag);
            }
        }

        Class.INHERITED_TAGS = dst;
    }

    return dst;
}

export default EntityBase;