
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
     * @param {Object} [opts={}] Any additional options.
     * @param {Object} [opts.componentFactoryMap={}] An object map of each component to its factory.
     * @param {Boolean} [opts.strictMode=false] Whether to enable error checking (and throwing).
     */
    constructor(opts = {})
    {
        const { componentFactoryMap = {}, strictMode = false } = opts;
        let factoryMap = {};
        let instances = {};
        for(let componentName in componentFactoryMap)
        {
            let factoryOption = componentFactoryMap[componentName];
            let create, destroy;
            try
            {
                create = 'create' in factoryOption
                    ? factoryOption.create
                    : (typeof factoryOption === 'function'
                        ? factoryOption
                        : null);
                destroy = 'destroy' in factoryOption
                    ? factoryOption.destroy
                    : null;
            }
            catch(e)
            {
                throw new Error('Unsupported component factory options.');
            }
            factoryMap[componentName] = { owner: factoryOption, create, destroy };
            instances[componentName] = {};
        }
        this.factoryMap = factoryMap;
        this.instances = instances;
        this.entities = new Set();
        this.nextAvailableEntityId = 1;
        this.strictMode = strictMode;
    }

    create(entityId = undefined)
    {
        if (typeof entityId !== 'undefined')
        {
            if (typeof entityId !== 'string')
            {
                throw new Error('Invalid type for entity id - must be a string.');
            }
        }
        else
        {
            entityId = String(this.nextAvailableEntityId++);
        }
        
        if (!this.entities.has(entityId))
        {
            this.entities.add(entityId);
            return entityId;
        }
        else
        {
            throw new Error(`Invalid duplicate entity id '${entityId}' allocated for new entity.`)
        }
    }

    destroy(entityId)
    {
        for(let componentName in this.instances)
        {
            this.remove(componentName, entityId);
        }
        this.entities.delete(entityId);
    }

    add(componentName, entityId, props = undefined)
    {
        if (!(componentName in this.factoryMap))
        {
            if (this.strictMode)
            {
                throw new Error(`Missing component factory for '${componentName}'.`);
            }
            else
            {
                this.factoryMap[componentName] = {
                    owner: {},
                    create: null,
                    destroy: null,
                };
                this.instances[componentName] = {};
            }
        }

        if (!(componentName in this.instances))
        {
            throw new Error(`Missing component instance mapping for '${componentName}'.`);
        }

        if (!this.entities.has(entityId))
        {
            throw new Error(`Entity '${entityId}' does not exist.`);
        }

        if (this.instances[componentName][entityId])
        {
            throw new Error(`Entity already has component '${componentName}'.`);
        }

        const { create } = this.factoryMap[componentName];
        let result = create
            ? create(typeof props !== 'undefined' ? props : DEFAULT_PROPS, entityId, this)
            : (props
                ? {...props}
                : {});
        if (result)
        {
            this.instances[componentName][entityId] = result;
        }
    }

    remove(componentName, entityId)
    {
        if (!(componentName in this.factoryMap))
        {
            if (this.strictMode)
            {
                throw new Error(`Missing component factory for '${componentName}'.`);
            }
            else
            {
                return;
            }
        }

        if (!(componentName in this.instances))
        {
            throw new Error(`Missing component instance mapping for '${componentName}'.`);
        }
        
        let entityComponents = this.instances[componentName];
        let componentValues = entityComponents[entityId];
        if (componentValues)
        {
            entityComponents[entityId] = null;
    
            const { destroy } = this.factoryMap[componentName];
            if (destroy) destroy(componentValues, entityId, this);
        }
    }

    /**
     * Finds the component for the given entity.
     * 
     * @param {String} componentName The name of the target component.
     * @param {EntityId} entityId The id of the entity to look in.
     * @returns {Object} The component found. If it does not exist, null
     * is returned instead.
     */
    get(componentName, entityId)
    {
        if (!(componentName in this.instances))
        {
            throw new Error(`Missing component instance mapping for '${componentName}'.`);
        }
        
        const entityComponents = this.instances[componentName];
        return entityComponents[entityId] || null;
    }
    
    /**
     * Checks whether the entity has the component.
     * 
     * @param {String} componentName The name of the target component.
     * @param {EntityId} entityId The id of the entity to look in.
     * @returns {Boolean} Whether the component exists for the entity.
     */
    has(componentName, entityId)
    {
        return componentName in this.instances && Boolean(this.instances[componentName][entityId]);
    }

    clear(componentName)
    {
        if (!(componentName in this.factoryMap))
        {
            if (this.strictMode)
            {
                throw new Error(`Missing component factory for '${componentName}'.`);
            }
            else
            {
                return;
            }
        }

        if (!(componentName in this.instances))
        {
            throw new Error(`Missing component instance mapping for '${componentName}'.`);
        }

        let entityComponents = this.instances[componentName];
        const { destroy } = this.factoryMap[componentName];
        if (destroy)
        {
            for(let entityId in entityComponents)
            {
                let componentValues = entityComponents[entityId];
                entityComponents[entityId] = null;

                destroy(componentValues, componentName, entityId, this);
            }
        }
        this.instances[componentName] = {};
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

    getComponentFactory(componentName)
    {
        if (componentName in this.factoryMap)
        {
            return this.factoryMap[componentName].owner;
        }
        else
        {
            return null;
        }
    }

    getComponentNames()
    {
        return Object.keys(this.factoryMap);
    }

    getComponentEntityIds(componentName)
    {
        if (componentName in this.instances)
        {
            return Object.keys(this.instances[componentName]);
        }
        else
        {
            return [];
        }
    }
    
    getComponentInstances(componentName)
    {
        if (componentName in this.instances)
        {
            return Object.values(this.instances[componentName]);
        }
        else
        {
            return [];
        }
    }
}
