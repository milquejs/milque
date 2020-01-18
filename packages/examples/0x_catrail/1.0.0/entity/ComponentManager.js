export class ComponentManager
{
    constructor(world)
    {
        this.world = world;
        this.componentClassToEntityComponentMap = new Map();
    }

    createComponent(entityId, componentClass, initialValues)
    {
        let component;

        // Instantiate the component...
        let type = typeof componentClass;
        if (type === 'object')
        {
            // NOTE: Although this checks the prototype chain on EVERY add, it only
            // checks on the class object, which should NOT have a chain.
            if (!('create' in componentClass))
            {
                throw new Error(`Instanced component class '${getComponentTypeName(componentClass)}' must at least have a create() function.`);
            }

            component = componentClass.create(this, entityId);
        }
        else if (type === 'function')
        {
            component = new componentClass(this, entityId);
        }
        else if (type === 'symbol')
        {
            // NOTE: Symbols lose their immutability when converted into a component
            // (their equality is checked by their toString() when computing its key)
            throw new Error('Symbols are not yet supported as components.');
        }
        else
        {
            // NOTE: This means that these can be numbers and strings.
            // HOWEVER, I caution against using numbers. Numbers can often be confused
            // with other operations (particularly when computation is involved).
            component = componentClass;
        }

        // Initialize the component...
        if (initialValues)
        {
            // Try user-defined static copy...
            if ('copy' in componentClass)
            {
                componentClass.copy(component, initialValues);
            }
            // Try user-defined instance copy...
            else if ('copy' in component)
            {
                component.copy(initialValues);
            }
            // Try default copy...
            else
            {
                for(let key of Object.getOwnPropertyNames(initialValues))
                {
                    component[key] = initialValues[key];
                }
            }
        }
        
        return component;
    }

    putComponent(entityId, componentClass, component, initialValues)
    {
        let entityComponentMap;
        if (this.componentClassToEntityComponentMap.has(componentClass))
        {
            entityComponentMap = this.componentClassToEntityComponentMap.get(componentClass);
        }
        else
        {
            this.componentClassToEntityComponentMap.set(componentClass, entityComponentMap = new Map());
        }

        if (entityComponentMap.has(entityId))
        {
            throw new Error(`Cannot add more than one instance of component class '${getComponentTypeName(componentClass)}' for entity '${entityId}'.`);
        }

        entityComponentMap.set(entityId, component);
        this.world.emit('componentadd', entityId, componentClass, component, initialValues);
    }

    deleteComponent(entityId, componentClass, component)
    {
        this.componentClassToEntityComponentMap.get(componentClass).delete(entityId);
    
        let reusable;
        if ('reset' in componentClass)
        {
            reusable = componentClass.reset(component);
        }
        else if ('reset' in component)
        {
            reusable = component.reset();
        }
        else
        {
            // Do nothing. It cannot be reset.
            reusable = false;
        }
    
        if (reusable)
        {
            // NOTE: There is no object pooling. It's up to you to prevent garbage fires.
            // The return statement is simply for documentation (and future optimizations).
        }

        this.world.emit('componentremove', entityId, componentClass, component);
    }

    hasComponentType(componentType)
    {
        return this.componentClassToEntityComponentMap.has(componentType);
    }

    getComponentTypes()
    {
        return this.componentClassToEntityComponentMap.keys();
    }

    getEntityComponentMap(componentType)
    {
        return this.componentClassToEntityComponentMap.get(componentType);
    }

    getEntityComponentMaps()
    {
        return this.componentClassToEntityComponentMap.values();
    }
}
