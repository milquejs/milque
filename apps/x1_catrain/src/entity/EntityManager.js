
/**
 * @typedef {String} EntityId
 * @typedef {String|Function|Object} ComponentType
 */

/**
 * @typedef {Function} FactoryCreateFunction
 * @param {String} entityId
 * @param {EntityManager} entityManager
 * @returns {Object} A new component.
 * 
 * @typedef {Function} FactoryDestroyFunction
 * @param {Object} component The component to be destroyed.
 * @param {String} entityId
 * @param {EntityManager} entityManager
 * 
 * @typedef ComponentFactory
 * @property {ComponentType} type
 * @property {FactoryCreateFunction|null} create
 * @property {FactoryDestroyFunction|null} destroy
 */

/**
 * Handles all entity and component mappings.
 * 
 * ## Entities
 * An entity is a simple id handle. This handle serves as a key to a
 * collection of associated component instances (by type).
 * 
 * ## Components
 * A component is an instance created by a component factory that is
 * derived from a registered component type.
 * 
 * ## Component Types
 * A component type is a registered identifier to a group of instances
 * generated from the same component factory. There are 2 kinds of
 * component types: Object and Tag. Object component types have factories
 * that create and manipulate object instances. Tag component types are
 * simple flags, usually for classification.
 * 
 * **Q: Since component types are just identifiers, why not use a string?**
 * 
 * > A: Firstly, we can now enforce component depedencies for entities and
 * systems through import (instead of runtime checks). Secondly, although
 * strings would provide better loose coupling and give overridable
 * extensibility (by changing another component type to the same name),
 * we actually want to discourage this behavior. If you want to extend a
 * component, you should actually create a supplemental component with its
 * own system to run alongside the existing system. Otherwise, intersystem
 * dependencies, which in an ECS system can easily become quite complex,
 * may unintentionally break and hard to track down. For simplicity, component
 * types should be treated like singletons.
 * 
 * **Q: Since components are just data blobs that initialize an entity, why
 * not also set the initialize the component values at the same time?**
 * 
 * > A: Always delay any architectural decisions as late as possible. So let's
 * not dictate how to setup a component. This manager only handles the
 * creation, deletion, and access of entity and its components. It should
 * not decide how you initialize or manipulate a component.
 * 
 * ## Entity to Component Types
 * In general, each entity has a single associated component instance per
 * component type. This means that only 1 component instance is allowed
 * per component type and entity pair, making component types unique per
 * entity.
 * 
 * Therefore, there should only always be 1 component of a type per entity.
 * This way when you implement a component type, you only have to worry
 * about handling a single instance of them per entity. Not ALL components
 * should be able to support multiple instances per entity as it would be
 * inefficient and extraneous.
 * 
 * However, some components benefit from having multiple instances. As such,
 * if more than 1 is needed, the component type must set `multiple` to be
 * true. For efficiency, non-singular functions, addMultiple(), removeMultiple(),
 * and getMultiple(), can be used when dealing with multiple instances with
 * these component types.
 * 
 * **Q: Since it is inefficient, and sometimes ambiguous, to use add(), remove(),
 * and get() functions for non-singular components, why not enforce the separate
 * API by disallowing non-singular uses in these functions?**
 * 
 * > A: For backwards compatibility and quick turn around. Consider if you created
 * a system that only considers 1 component instance per entity. If in the future
 * you decide to change this component to multiple, you would have to hunt down
 * all these function calls and change them to their respective non-singular
 * counterparts. Although this should be done for better performance, it is at a
 * much greater cost of development speed and experience. Furthermore, you can
 * still opt-in and optimize by replacing them.
 */
export class EntityManager
{
    /**
     * Constructs an empty entity manager with the given factories.
     * 
     * @param {Object} [opts] Any additional options.
     * @param {Object} [opts.components={}] An object map of each component to its factory.
     * @param {Boolean} [opts.strictMode=false] Whether to enable error checking (and throwing).
     */
    constructor(opts = {})
    {
        const { components = [], strictMode = false } = opts;

        let factories = new Map();
        for(let componentType of components)
        {
            let componentFactory = getFactory(componentType);
            factories.set(componentType, componentFactory);
        }
        this.components = factories;
        this.entities = new Set();
        this.strictMode = strictMode;

        this.nextAvailableEntityId = 1;
    }

    /**
     * @param {EntityId} entityId
     * @returns {EntityId} The new entity's id.
     */
    create(entityId = String(this.nextAvailableEntityId++))
    {
        if (this.strictMode)
        {
            if (typeof entityId !== 'string') throw new Error(`Invalid non-string type for entity id '${entityId}'.`);
            if (this.entities.has(entityId)) throw new Error(`Invalid duplicate entity id '${entityId}' allocated for new entity.`)
        }

        this.entities.add(entityId);
        return entityId;
    }

    destroy(entityId)
    {
        for(let componentType of this.components.keys())
        {
            this.remove(componentType, entityId);
        }
        this.entities.delete(entityId);
    }

    /** @private */
    _resolveComponentFactory(componentType)
    {
        let factory;
        if (!this.components.has(componentType))
        {
            factory = getFactory(componentType);
            this.components.set(componentType, factory);
        }
        else
        {
            factory = this.components.get(componentType);
        }
        return factory;
    }

    /**
     * Creates an instance of the given component type from its factory
     * and adds the instance as the associated component for the type and
     * entity.
     * 
     * When not in strict-mode, if a component of the same type already
     * exists for the entity, then it will replace it. If the component
     * is non-singular, it will append to the existing collection.
     * 
     * The 'replace' operation is generally discouraged as it skips all
     * component deletion logic, including callbacks and event handlers.
     * But, for efficiency, it exists.
     * 
     * @param {ComponentType} componentType The component type to add an instance of.
     * @param {EntityId} entityId The entity id to add the component to.
     * @returns {Object} The component instance.
     */
    add(componentType, entityId)
    {
        if (this.strictMode)
        {
            if (!componentType)
            {
                throw new Error(`Cannot add null or undefined component type ${getName(componentType)}`);
            }

            if (typeof componentType !== 'string' && !('name' in componentType))
            {
                throw new Error(`Unnamed component types are not supported - ${JSON.stringify(componentType)}`);
            }

            if (!this.components.has(componentType))
            {
                if (typeof componentType === 'string')
                {
                    throw new Error(`Found unregistered tag component ${getName(componentType)}.`);
                }
                else
                {
                    throw new Error(`Missing component factory for ${getName(componentType)}.`);
                }
            }

            if (typeof entityId !== 'string')
            {
                throw new Error(`Invalid entity id type; expected string but found ${typeof entityId} instead.`);
            }

            if (!this.entities.has(entityId))
            {
                throw new Error(`Entity '${entityId}' does not exist.`);
            }

            if (!this.components.get(componentType).multiple && this.components.get(componentType).instances[entityId])
            {
                throw new Error(`Cannot add duplicate non-multiple component - entity already has component ${getName(componentType)}.`);
            }
        }

        let factory = this._resolveComponentFactory(componentType);
        let { multiple, instances } = factory;

        let component = factory.create(entityId, this);
        if (multiple)
        {
            let componentList = instances[entityId];
            if (componentList)
            {
                componentList.push(component);
            }
            else
            {
                instances[entityId] = [component];
            }
        }
        else
        {
            instances[entityId] = component;
        }
        return component;
    }

    /**
     * Removes the associated instance of the given component type from
     * the entity and destroys it using its own factory.
     * 
     * If the component is non-singular, it will remove one instance by
     * insertion order.
     * 
     * @param {ComponentType} componentType The component type to remove for.
     * @param {EntityId} entityId The entity id to remove the component from.
     * @returns {Boolean} Whether a component was removed by this call.
     */
    remove(componentType, entityId)
    {
        if (this.strictMode)
        {
            if (!this.components.has(componentType))
            {
                throw new Error(`Missing component factory for ${getName(componentType)}.`);
            }
        }

        let factory = this.components.get(componentType);
        let { instances, multiple } = factory;

        let component = instances[entityId];
        if (component)
        {
            if (multiple)
            {
                let componentList = component;
                component = componentList.shift();
                if (componentList.length <= 0)
                {
                    instances[entityId] = null;
                }
            }
            else
            {
                instances[entityId] = null;
            }
            factory.destroy(component, entityId, this);
            return true;
        }
        return false;
    }

    /**
     * Finds the component for the given entity. Assumes the component
     * exists for the entity.
     * 
     * If the component is non-singular, it will return the first,
     * non-removed instance.
     * 
     * @param {ComponentType} componentType The target component type.
     * @param {EntityId} entityId The id of the entity to look in.
     * @returns {Object} The component found. If it does not exist, null
     * is returned instead.
     */
    get(componentType, entityId)
    {
        if (this.strictMode)
        {
            if (!this.components.has(componentType))
            {
                throw new Error(`Missing component factory for ${getName(componentType)}.`);
            }
        }

        let factory = this.components.get(componentType);
        let { multiple, instances } = factory;

        if (multiple)
        {
            return instances[entityId][0];
        }
        else
        {
            return instances[entityId];
        }
    }

    addMultiple(componentType, entityId, addCount = 1)
    {
        let factory = this._resolveComponentFactory(componentType);
        let { multiple, instances } = factory;

        if (multiple)
        {
            if (addCount <= 0)
            {
                throw new Error('Must add a positive amount of instances for non-singular component.');
            }

            let componentList = instances[entityId];
            if (!componentList)
            {
                componentList = [];
                instances[entityId] = componentList;
            }

            let result = [];
            for(; addCount > 0; --addCount)
            {
                let component = factory.create(entityId, this);
                result.push(component);
                componentList.push(component);
            }
            return result;
        }
        else
        {
            throw new Error(`Cannot add multiple for non-multiple component type ${getName(componentType)}.`);
        }
    }

    removeMultiple(componentType, entityId, startIndex = 0, removeCount = undefined)
    {
        let factory = this.components.get(componentType);
        let { multiple, instances } = factory;

        if (multiple)
        {
            let componentList = instances[entityId];
            let result = componentList.splice(startIndex, removeCount);
            if (componentList.length <= 0)
            {
                instances[entityId] = null;
            }
            for(let component of result)
            {
                factory.destroy(component, entityId, this);
            }
            return result.length > 0;
        }
        else
        {
            throw new Error(`Cannot remove multiple for non-multiple component type ${getName(componentType)}.`);
        }
    }

    getMultiple(componentType, entityId, startIndex = 0, getCount = undefined)
    {
        let factory = this.components.get(componentType);
        let { multiple, instances } = factory;

        if (multiple)
        {
            let list = instances[entityId];
            if (getCount)
            {
                return list.slice(startIndex, startIndex + getCount);
            }
            else
            {
                return list.slice(startIndex);
            }
        }
        else
        {
            throw new Error(`Cannot get multiple for non-multiple component type ${getName(componentType)}.`);
        }
    }
    
    /**
     * Checks whether the entity has the component.
     * 
     * @param {ComponentType} componentType The target component type.
     * @param {EntityId} entityId The id of the entity to look in.
     * @returns {Boolean} Whether the component exists for the entity.
     */
    has(componentType, entityId)
    {
        return this.components.has(componentType) && Boolean(this.components.get(componentType).instances[entityId]);
    }

    clear(componentType = undefined)
    {
        if (this.strictMode)
        {
            if (!this.components.has(componentType))
            {
                throw new Error(`Missing component factory for ${getName(componentType)}.`);
            }
        }

        if (!componentType)
        {
            for(let componentType of this.components.keys())
            {
                this.clear(componentType);
            }
        }
        else
        {
            let factory = this.components.get(componentType);
            let { multiple, instances } = factory;
    
            if (multiple)
            {
                for(let entityId in instances)
                {
                    let componentList = instances[entityId];
                    if (componentList)
                    {
                        instances[entityId] = null;
                        for(let component of componentList)
                        {
                            factory.destroy(component, entityId, this);
                        }
                    }
                }
            }
            else
            {
                for(let entityId in instances)
                {
                    let component = instances[entityId];
                    if (component)
                    {
                        instances[entityId] = null;
                        factory.destroy(component, entityId, this);
                    }
                }
            }
            factory.instances = {};
        }
    }

    /**
     * Gets all the entity ids.
     * 
     * @returns {Set<EntityId>} The set of entity ids.
     */
    getEntityIds()
    {
        return this.entities;
    }

    getComponentFactory(componentType)
    {
        return this.components.get(componentType);
    }

    getComponentTypes()
    {
        return this.components.keys();
    }

    /**
     * Gets all the current entity ids of the given component type.
     * 
     * @param {ComponentType} componentType The component type to get entity ids for.
     * @returns {Array<EntityId>} The list of all entity ids for the component type.
     */
    getComponentEntityIds(componentType)
    {
        if (this.strictMode)
        {
            if (!this.components.has(componentType))
            {
                throw new Error(`Missing component factory for ${getName(componentType)}.`);
            }
        }
        
        return Object.keys(this.components.get(componentType).instances);
    }
    
    /**
     * Gets all the current instances of the given component type.
     * 
     * @param {ComponentType} componentType The component type to get instances for.
     * @param {Boolean} [flatten=true] Whether to flatten the instance list for non-singular component
     * types. In other words, if the component type is non-singular and this is false, then it will
     * return a list of instance lists. This is generally faster if you know you are working with a
     * non-singular component. By default, this is true for backwards compatibility.
     * @returns {Array<Object>|Array<Array<Object>>} The list of all instances, or instance lists, for
     * the component type.
     */
    getComponentInstances(componentType, flatten = true)
    {
        if (this.strictMode)
        {
            if (!this.components.has(componentType))
            {
                throw new Error(`Missing component factory for ${getName(componentType)}.`);
            }
        }

        let factory = this.components.get(componentType);
        let { multiple, instances } = factory;

        if (multiple && flatten)
        {
            let result = [];
            for(let entityId in instances)
            {
                let componentList = instances[entityId];
                if (componentList)
                {
                    result.push(...componentList);
                }
            }
            return result;
        }
        else
        {
            return Object.values(instances);
        }
    }
}

const DefaultComponent = {
    create() { return {}; },
    destroy() {},
};
const TagComponent = {
    create() { return true; },
    destroy() {},
};

function getName(componentType)
{
    if (typeof componentType === 'string')
    {
        return `'${componentType}'`;
    }
    else
    {
        return componentType.name || componentType;
    }
}

/**
 * @param {ComponentType} componentType The component type to create the factory for.
 * @returns {ComponentFactory} The associated component factory.
 */
function getFactory(componentType)
{
    if (typeof componentType === 'string')
    {
        return {
            type: componentType,
            multiple: false,
            create: TagComponent.create,
            destroy: TagComponent.destroy,
            instances: {},
        };
    }
    else
    {
        try
        {
            let multiple = 'multiple' in componentType ? Boolean(componentType.multiple) : false;
            return {
                type: componentType,
                multiple,
                create: 'create' in componentType
                    ? componentType.create
                    : (typeof componentType === 'function'
                        ? componentType
                        : DefaultComponent.create),
                destroy: 'destroy' in componentType
                    ? componentType.destroy
                    : DefaultComponent.destroy,
                instances: {},
            };
        }
        catch(e)
        {
            throw new Error('Unsupported component factory options.');
        }
    }
}
