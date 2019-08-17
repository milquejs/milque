import EntityView from './EntityView.js';
import EntityBase from './EntityBase.js';

import ComponentManager from './component/ComponentManager.js';
import ComponentTagFactory from './component/ComponentTagFactory.js';
import ComponentObjectFactory from './component/ComponentObjectFactory.js';
import ComponentFunctionFactory from './component/ComponentFunctionFactory.js';
import ComponentClassFactory from './component/ComponentClassFactory.js';
import ComponentBase from './component/ComponentBase.js';

class EntityManager
{
    constructor()
    {
        this._entities = new Set();
        this._componentManagers = new Map();
        this._nextEntityID = 1;
    }

    registerComponent(component, componentFactory = null)
    {
        if (!componentFactory)
        {
            if (typeof component === 'string')
            {
                componentFactory = new ComponentTagFactory(component);
            }
            else if (typeof component === 'object')
            {
                componentFactory = new ComponentObjectFactory(component);
            }
            else if (component instanceof ComponentBase)
            {
                componentFactory = new ComponentClassFactory(component);
            }
            else if (typeof component === 'function')
            {
                componentFactory = new ComponentFunctionFactory(component);
            }
            else
            {
                throw new Error('Cannot find factory for component type.');
            }
        }

        const componentManager = new ComponentManager(componentFactory);
        this._componentManagers.set(component, componentManager);
        return componentManager;
    }

    unregisterComponent(component)
    {
        this._componentManagers.delete(component);
    }

    /**
     * Creates an entity.
     * @param  {...any} components Any components to be assigned to the created entity.
     * @returns {Number} The id of the entity created.
     */
    create(...components)
    {
        const entity = this._nextEntityID++;
        this._entities.add(entity);
        for(const component of components)
        {
            this.assign(entity, component);
        }
        return entity;
    }

    /**
     * Destroys an entity and all its components.
     * @param {Number} entity The id of the entity to be destroyed.
     */
    destroy(entity)
    {
        for(const componentManager of this._componentManagers.values())
        {
            if (componentManager.has(entity))
            {
                componentManager.remove(entity);
            }
        }
        this._entities.delete(entity);
    }

    /**
     * Spawns an entity of the class type. This serves as the hybrid ECS / MVC entity.
     * The returned value can be treated as the entity object itself and any manipulations
     * should be handled through that object. Implementation-wise, the created instance is
     * treated as a component (with fancy callbacks) and therefore can easily interoperate
     * with other components while being able to own its data and logic. In other words,
     * you can easily substitute a Component with a EntityClass for any component function,
     * including entitites(), has(), etc.
     * 
     * NOTE: Because references to this instance may exist AFTER it has been destroyed, it
     * is NOT recommended to destroy() or remove() "class" components from the manager.
     * Instead, it should be done through the entity itself, and therefore the user will
     * at least SEE the destruction and take action in removing it manually.
     * 
     * @param {Class<EntityBase>} EntityClass The class of the entity to create.
     * @param  {...any} args Any additional arguments to pass to the entity's create().
     * @returns {EntityBase} The handler component for the entity.
     */
    spawn(EntityClass = EntityBase, ...args)
    {
        const entity = ENTITY_MANAGER.create();
        return ENTITY_MANAGER.assign(entity, EntityClass, ENTITY_MANAGER, entity, ...args);
    }

    entities(...components)
    {
        return new EntityView(this, (entity) => this.has(entity, ...components));
    }

    has(entity, ...components)
    {
        for(const component of components)
        {
            if (this._componentManagers.has(component))
            {
                if (!this._componentManagers.get(component).has(entity))
                {
                    return false;
                }
            }
            else
            {
                return false;
            }
        }

        return true;
    }

    get(entity, component, ...components)
    {
        if (components.length > 0)
        {
            const dst = [];
            dst.push(this._componentManagers.get(component).get(entity));
            for(const c of components)
            {
                dst.push(this._componentManagers.get(c).get(entity));
            }
            return dst;
        }
        else
        {
            return this._componentManagers.get(component).get(entity);
        }
    }

    assign(entity, component, ...args)
    {
        let componentManager;
        if (!this._componentManagers.has(component))
        {
            this.registerComponent(component);
        }
        else
        {
            componentManager = this._componentManagers.get(component);
        }
        return componentManager.add(entity, ...args);
    }

    remove(entity, ...components)
    {
        for(const c of components)
        {
            this._componentManagers.get(c).remove(entity);
        }
    }

    clear(...components)
    {
        if (this.components.length > 0)
        {
            for(const c of components)
            {
                this._componentManagers.get(c).clear();
            }
        }
        else
        {
            this._componentManagers.clear();
            this._entities.clear();
        }
    }
}

export default EntityManager;