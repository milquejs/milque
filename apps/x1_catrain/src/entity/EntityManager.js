
/**
 * TODO: Change to use ref instead of names.
 * Use REFERENCES as keys, instead of strings.
 * - This way, we can enforce depedencies throught import.
 * - The benefits of strings is the loose coupling, but
 * this only allow us to add additional functionality,
 * which, if components are optimized which they should be,
 * then it can be easily done by create a Position2 instead.
 */

/**
 * TODO: Enforce 1 component only.
 * There should only always be 1 component per entity, that way
 * when you implement Transform, you only have to worry about 1
 * of them. Not ALL components should be able to support multiple
 * per entity.
 * 
 * BUT, some do. So we need a way to allow for MultiComponents,
 * which are arrays of components, identified by some index/id.
 */

/**
 * TODO: Components should init from template.
 * Delay any architectural decisions as late as possible. So let's
 * not dictate how to setup a component.
 */

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
const DEFAULT_PROPS = {};

/**
 * Handles all entity and component mappings.
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

    add(componentType, entityId)
    {
        if (this.strictMode)
        {
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

            if (entityId in this.components.get(componentType).instances)
            {
                throw new Error(`Entity already has component ${getName(componentType)}.`);
            }

            if (!this.entities.has(entityId))
            {
                throw new Error(`Entity '${entityId}' does not exist.`);
            }
        }

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
        let component = factory.create(entityId, this);
        factory.instances[entityId] = component;
        return component;
    }

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
        let { instances } = factory;
        let component = instances[entityId];
        if (component)
        {
            instances[entityId] = null;
            factory.destroy(component, entityId, this);
            return true;
        }
        return false;
    }

    /**
     * Finds the component for the given entity.
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

        return this.components.get(componentType).instances[entityId];
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

    clear(componentType)
    {
        if (this.strictMode)
        {
            if (!this.components.has(componentType))
            {
                throw new Error(`Missing component factory for ${getName(componentType)}.`);
            }
        }

        let factory = this.components.get(componentType);
        let { instances } = factory;
        for(let entityId in instances)
        {
            let component = instances[entityId];
            instances[entityId] = null;
            factory.destroy(component, entityId, this);
        }
        factory.instances = {};
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

    getComponentEntityIds(componentType)
    {
        return Object.keys(this.components.get(componentType).instances);
    }
    
    getComponentInstances(componentType)
    {
        return Object.values(this.components.get(componentType).instances);
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
