import ComponentInstanceBase from './component/ComponentInstanceBase.js';

class EntityBase extends ComponentInstanceBase
{
    constructor(entityManager, entityID, ...args)
    {
        super();
        this.entityManager = entityManager;
        this.entityID = entityID;
    }
    
    /** @override */
    onChange(...args) {}

    /** @override */
    onDestroy()
    {
        this.entityManager.destroy(this.entityID, {
            exclude: [this.constructor]
        });
    }

    destroy()
    {
        this.entityManager.destroy(this.entityID);
    }

    /**
     * If the component does not exist for the entity, it will assign
     * a new instance of the component. Otherwise, it will update the
     * component instance based on the arguments passed-in.
     * @param {ComponentBase|Function} component The component to add/upate for this entity.
     * @param  {...any} args Any additional args to pass to component.
     */
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
                if (propDescriptor && propDescriptor.value) instance[key] = value;

                /**
                 * This is important. On a macro level, this let's the programmer
                 * to focus less on the data structure of the program by allowing
                 * them to initially, arbitrarily decide where to store the data:
                 * either on the entity handler itself for ease of use or separated
                 * by components. The programmer can then easily refactor the
                 * properties, once there is a better understanding of the program's
                 * design and features, into modular components when needed. Since
                 * access of both kinds are the same, this process is really easy.
                 * The difference is only in how they are created, which is usually
                 * referenced only once.
                 */
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
}

export default EntityBase;