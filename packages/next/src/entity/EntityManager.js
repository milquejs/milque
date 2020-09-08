/**
 * @typedef {String} EntityId
 */

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
            if (typeof factoryOption === 'function')
            {
                create = factoryOption;
                destroy = null;
            }
            else if (typeof factoryOption === 'object')
            {
                create = factoryOption.create || null;
                destroy = factoryOption.destroy || null;
            }
            else
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

    create(entityTemplate = undefined)
    {
        let entityId = String(this.nextAvailableEntityId++);
        this.entities.add(entityId);
        if (entityTemplate)
        {
            if (Array.isArray(entityTemplate))
            {
                for(let componentName of entityTemplate)
                {
                    this.add(componentName, entityId);
                }
            }
            else if (typeof entityTemplate === 'object')
            {
                for(let componentName in entityTemplate)
                {
                    this.add(componentName, entityId, entityTemplate[componentName]);
                }
            }
            else
            {
                throw new Error('Invalid component options.');
            }
        }
        return entityId;
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
            ? create(props, entityId, this)
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
