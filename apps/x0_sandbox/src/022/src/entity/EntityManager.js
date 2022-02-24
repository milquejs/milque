import { AutoFactoryResolverMap, resolve } from './AutoFactoryResolver.js';

/**
 * @typedef {String} EntityId
 * @typedef {String|Function|Object} ComponentType
 */

const DEFAULT_PROPS = {};

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
     * Constructs an empty entity manager with the given component registry.
     * 
     * @param {Object} [opts] Any additional options.
     * @param {Map<any, import('./ComponentFactory.js').ComponentFactory>} [opts.componentRegistry]
     * The component to factory mapping to use. If undefined, it will use an empty map for strict mode.
     * If not in strict mode, it will try to resolve the factory for the given type the best it can.
     * @param {Boolean} [opts.strictMode=false] Whether to enable error checking
     * (and throwing).
     */
    constructor(opts = {})
    {
        const {
            componentRegistry = undefined,
            strictMode = false
        } = opts;
        
        /** @type {Map<EntityId, import('./ComponentFactory.js').ComponentFactory>} */
        this.components = componentRegistry || (strictMode ? new Map() : new AutoFactoryResolverMap());
        this.entities = new Set();
        this.strictMode = strictMode;
        this.nextAvailableEntityId = 1;
    }

    register(componentType, componentFactory = undefined)
    {
        if (!this.components.has(componentType))
        {
            // NOTE: Only auto resolve if it doesn't exist (or it wasn't handled by the registry).
            if (!componentFactory && !this.components.get(componentType))
            {
                componentFactory = resolve(componentType);
            }
            this.components.set(componentType, componentFactory);
        }
        return this;
    }

    unregister(componentType)
    {
        if (this.components.has(componentType))
        {
            this.components.delete(componentType);
        }
        return this;
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
     * @param {Object} props An object map of properties to pass to the factory create function.
     * @returns {Object} The component instance.
     */
    add(componentType, entityId, props = undefined)
    {
        if (this.strictMode)
        {
            if (!componentType)
            {
                throw new Error(`Cannot add null or undefined component type ${getComponentTypeName(componentType)}`);
            }

            if (typeof componentType !== 'string' && !('name' in componentType))
            {
                throw new Error(`Unnamed component types are not supported - ${JSON.stringify(componentType)}`);
            }

            if (!this.components.has(componentType))
            {
                if (typeof componentType === 'string')
                {
                    throw new Error(`Found unregistered tag component ${getComponentTypeName(componentType)}.`);
                }
                else
                {
                    throw new Error(`Missing component factory for ${getComponentTypeName(componentType)}.`);
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
        }

        let factory = this.components.get(componentType);
        let component = factory.add(entityId, props || DEFAULT_PROPS);
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
                throw new Error(`Missing component factory for ${getComponentTypeName(componentType)}.`);
            }
        }

        let factory = this.components.get(componentType);
        let component = factory.get(entityId);
        if (component)
        {
            factory.delete(entityId);
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
                throw new Error(`Missing component factory for ${getComponentTypeName(componentType)}.`);
            }
        }

        let factory = this.components.get(componentType);
        return factory.get(entityId);
    }

    /**
     * Finds all the components for the given entity. Assumes the component
     * type exists for the entity.
     * 
     * If the component is non-multiple, it will return an array of the only
     * associated instance.
     * 
     * @param {ComponentType} componentType The target component type.
     * @param {EntityId} entityId The id of the entity to look in.
     * @returns {Object} The component found. If it does not exist, null
     * is returned instead.
     */
    getAll(componentType, entityId)
    {
        if (this.strictMode)
        {
            if (!this.components.has(componentType))
            {
                throw new Error(`Missing component factory for ${getComponentTypeName(componentType)}.`);
            }
        }

        let factory = this.components.get(componentType);
        return factory.getAll(entityId);
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
        let factory = this.components.get(componentType);
        return factory && Boolean(factory.get(entityId));
    }

    clear(componentType = undefined)
    {
        if (this.strictMode)
        {
            if (!this.components.has(componentType))
            {
                throw new Error(`Missing component factory for ${getComponentTypeName(componentType)}.`);
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
            factory.clear();
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

    /**
     * @param {ComponentType} componentType
     * @returns {import('./ComponentFactory.js').ComponentFactory} The component factory for the given component type.
     */
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
                throw new Error(`Missing component factory for ${getComponentTypeName(componentType)}.`);
            }
        }

        let factory = this.components.get(componentType);
        return factory.keys();
    }
    
    /**
     * Gets all the current instances of the given component type.
     * 
     * @param {ComponentType} componentType The component type to get instances for.
     * @returns {Array<Object>} The list of all instances, or instance lists, for
     * the component type.
     */
    getComponentInstances(componentType)
    {
        if (this.strictMode)
        {
            if (!this.components.has(componentType))
            {
                throw new Error(`Missing component factory for ${getComponentTypeName(componentType)}.`);
            }
        }

        let factory = this.components.get(componentType);
        return factory.values();
    }
}

/**
 * @param {*} componentType The component type.
 * @returns {String} The name of the component type.
 */
function getComponentTypeName(componentType)
{
    switch(typeof componentType)
    {
        case 'string': return `'${componentType}'`;
        case 'object':
        case 'function':
            return componentType.name || componentType;
        default: return componentType;
    }
}
