import EntityView from './EntityView.js';

import ComponentManager from './component/ComponentManager.js';
import ComponentBase from './component/ComponentBase.js';
import ComponentInstanceBase from './component/ComponentInstanceBase.js';
import ComponentTagFactory from './component/factory/ComponentTagFactory.js';
import ComponentClassFactory from './component/factory/ComponentClassFactory.js';
import ComponentClassInstanceFactory from './component/factory/ComponentClassInstanceFactory.js';
import ComponentFunctionFactory from './component/factory/ComponentFunctionFactory';

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
            // It's a tag component.
            if (typeof component === 'string')
            {
                componentFactory = new ComponentTagFactory(component);
            }
            else if (component.prototype instanceof ComponentBase)
            {
                componentFactory = new ComponentClassFactory(component);
            }
            else if (component.prototype instanceof ComponentInstanceBase)
            {
                componentFactory = new ComponentClassInstanceFactory(component);
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
     * @param {Object} opts Any additional options.
     * @param {Array} opts.exclude Will not remove specified components. This
     * is usually used to delay destruction of a component type until later.
     * @param {Boolean} opts.persist If true, will NOT remove entity from entity
     * list.
     */
    destroy(entity, opts = {})
    {
        for(const componentType of this._componentManagers.keys())
        {
            const componentManager = this._componentManagers.get(componentType);
            if (componentManager.has(entity))
            {
                if (opts.exclude && opts.exclude.includes(componentType))
                {
                    continue;
                }
                else
                {
                    componentManager.remove(entity);
                }
            }
        }

        if (!opts.persist)
        {
            this._entities.delete(entity);
        }
    }

    entities(...components)
    {
        return new EntityView(this, (entity) => this.has(entity, ...components));
    }

    has(entity, ...components)
    {
        if (!this._entities.has(entity)) return false;
        
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

    /**
     * Gets the component instances for the listed components. If only 1 component is passed in,
     * then just the instance is returned. Otherwise, an array of all listed components, in the order
     * provided, is returned instead (this allows easy spreading of values).
     * @param {Number} entity The id of the entity for the components.
     * @param {ComponentBase|Function|String} component The component type to get the instance for.
     * @param  {...ComponentBase|Function|String} components Additional component types to get instances for.
     * @returns {Object|Array<Object>}
     */
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

    /**
     * Assigns the component to the entity. Assumes component does not exist
     * for the entity yet.
     * @param {Number} entity The id of the entity to assign to.
     * @param {ComponentBase|Function|String} component The component type to create.
     * @param  {...any} args Additional args passed to the component to create.
     * @returns {Object} The component instance assigned.
     */
    assign(entity, component, ...args)
    {
        if (typeof entity !== 'number') throw new Error('Invalid entity handle - must be a number.');
        
        let componentManager;
        if (!this._componentManagers.has(component))
        {
            componentManager = this.registerComponent(component);
        }
        else
        {
            componentManager = this._componentManagers.get(component);
        }
        return componentManager.add(entity, ...args);
    }

    /**
     * Changes the component for the entity. Assumes component has already been
     * assigned to the entity.
     * @param {Number} entity The id of the entity to change.
     * @param {ComponentBase|Function|String} component The component type to change.
     * @param  {...any} args Additional args passed to the component to change.
     * @returns {Object} The component instance changed.
     */
    change(entity, component, ...args)
    {
        if (typeof entity !== 'number') throw new Error('Invalid entity handle - must be a number.');

        // Due to assumption, this will NEVER be null.
        const componentManager = this._componentManagers.get(component);
        return componentManager.change(entity, ...args);
    }

    /**
     * Removes the listed components from the entity. If component does not exist
     * for the entity, it is ignored.
     * @param {Number} entity The id of the entity to remove from.
     * @param  {...any} components The component types to remove.
     */
    remove(entity, ...components)
    {
        for(const c of components)
        {
            if (this._componentManagers.has(c))
            {
                const componentManager = this._componentManagers.get(c);
                if (componentManager.has(entity))
                {
                    componentManager.remove(entity);
                }
            }
        }
    }

    /**
     * Clears all instances of the listed component type. If none are supplied, then all are removed.
     * If the component has no instances, it is skipped.
     * @param {...ComponentBase|Function|String} components Component types to be cleared.
     */
    clear(...components)
    {
        if (components.length > 0)
        {
            for(const c of components)
            {
                if (this._componentManagers.has(c))
                {
                    const componentManager = this._componentManagers.get(c);
                    componentManager.clear();
                }
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