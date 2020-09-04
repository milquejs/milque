export class EntityManager
{
    constructor(componentFactoryMap)
    {
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
    }

    create()
    {
        let entityId = this.nextAvailableEntityId++;
        this.entities.add(entityId);
        return entityId;
    }

    destroy(entityId)
    {
        for(let componentName in this.instances)
        {
            this.remove(componentName, entityId);
        }
        this.entities[entityId] = null;
    }

    add(componentName, entityId, props = undefined)
    {
        if (!(componentName in this.factoryMap))
        {
            throw new Error(`Missing component factory for '${componentName}'.`);
        }

        if (!(componentName in this.instances))
        {
            throw new Error(`Missing component instance mapping for '${componentName}'.`);
        }

        if (!(entityId in this.entities))
        {
            throw new Error(`Missing entity for '${componentName}'.`);
        }

        if (this.instances[componentName][entityId])
        {
            throw new Error(`Entity already has component '${componentName}'.`);
        }

        const { create } = this.factoryMap[componentName];
        let result = create ? create(props, componentName, entityId, this) : {};
        this.instances[componentName][entityId] = result;
        return this;
    }

    remove(componentName, entityId)
    {
        if (!(componentName in this.factoryMap))
        {
            throw new Error(`Missing component factory for '${componentName}'.`);
        }

        if (!(componentName in this.instances))
        {
            throw new Error(`Missing component instance mapping for '${componentName}'.`);
        }
        
        let entityComponents = this.instances[componentName];
        let componentValues = entityComponents[entityId];
        entityComponents[entityId] = null;

        const { destroy } = this.factoryMap[componentName];
        if (destroy) destroy(componentValues, componentName, entityId, this);
        return this;
    }

    get(componentName, entityId)
    {
        if (!(componentName in this.instances))
        {
            throw new Error(`Missing component instance mapping for '${componentName}'.`);
        }
        
        const entityComponents = this.instances[componentName];
        return entityComponents[entityId] || null;
    }

    clear(componentName)
    {
        if (!(componentName in this.factoryMap))
        {
            throw new Error(`Missing component factory for '${componentName}'.`);
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

    getEntities()
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

    getComponentEntities(componentName)
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
