import { EntityComponent } from '../hybrid/EntityComponent.js';

/**
 * @fires componentadd
 * @fires componentremove
 */
export class ComponentHandler
{
    constructor(entityHandler)
    {
        this._entityHandler = entityHandler;
        this.componentTypeInstanceMap = new Map();
    }

    createComponent(componentType, initialValues)
    {
        let component;

        // Instantiate the component...
        let type = typeof componentType;
        if (type === 'object')
        {
            // NOTE: Although this checks the prototype chain on EVERY add, it only
            // checks on the class object, which should NOT have a chain.
            if (!('create' in componentType))
            {
                throw new Error(`Instanced component class '${getComponentTypeName(componentType)}' must at least have a create() function.`);
            }

            component = componentType.create(this);
        }
        else if (type === 'function')
        {
            // HACK: This is a hack debugging tool to stop wrong use.
            if (componentType.prototype instanceof EntityComponent)
            {
                throw new Error('This component cannot be added to an existing entity; it can only initialize itself.');
            }

            component = new componentType(this);
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
            component = componentType;
        }

        // Initialize the component...
        if (initialValues)
        {
            this.copyComponent(componentType, component, initialValues);
        }
        
        return component;
    }

    putComponent(entityId, componentType, component, initialValues)
    {
        let componentInstanceMap;
        if (this.componentTypeInstanceMap.has(componentType))
        {
            componentInstanceMap = this.componentTypeInstanceMap.get(componentType);
        }
        else
        {
            this.componentTypeInstanceMap.set(componentType, componentInstanceMap = new Map());
        }

        if (componentInstanceMap.has(entityId))
        {
            throw new Error(`Cannot add more than one instance of component class '${getComponentTypeName(componentType)}' for entity '${entityId}'.`);
        }

        componentInstanceMap.set(entityId, component);

        this._entityHandler.dispatchEntityEvent(entityId, 'componentadd', [entityId, componentType, component, initialValues]);
    }

    deleteComponent(entityId, componentType, component)
    {
        this.componentTypeInstanceMap.get(componentType).delete(entityId);
    
        let reusable;
        // It's a tag. No reuse.
        if (componentType === component)
        {
            reusable = false;
        }
        // Try user-defined static reset...
        else if ('reset' in componentType)
        {
            reusable = componentType.reset(component);
        }
        // Try user-defined instance reset...
        else if ('reset' in component)
        {
            reusable = component.reset();
        }
        // Try default reset...
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

        this._entityHandler.dispatchEntityEvent(entityId, 'componentremove', [entityId, componentType, component]);
        return component;
    }

    copyComponent(componentType, component, targetValues)
    {
        // It's a tag. No need to copy.
        if (componentType === component)
        {
            return;
        }
        // Try user-defined static copy...
        else if ('copy' in componentType)
        {
            componentType.copy(component, targetValues);
        }
        // Try user-defined instance copy...
        else if ('copy' in component)
        {
            component.copy(targetValues);
        }
        // Try default copy...
        else
        {
            for(let key of Object.getOwnPropertyNames(targetValues))
            {
                component[key] = targetValues[key];
            }
        }
    }

    hasComponentType(componentType)
    {
        return this.componentTypeInstanceMap.has(componentType);
    }

    getComponentTypes()
    {
        return this.componentTypeInstanceMap.keys();
    }

    getComponentInstanceMapByType(componentType)
    {
        return this.componentTypeInstanceMap.get(componentType);
    }

    getComponentInstanceMaps()
    {
        return this.componentTypeInstanceMap.values();
    }
}
