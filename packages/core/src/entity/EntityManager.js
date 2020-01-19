import { EntityQuery } from './query/EntityQuery.js';
import { getComponentTypeName } from './component/ComponentHelper.js';
import { EntityHandler } from './handlers/EntityHandler.js';
import { ComponentHandler } from './handlers/ComponentHandler.js';

/**
 * @typedef EntityId
 * The unique id for every entity in a world.
 */

/**
 * Manages all entities.
 */
export class EntityManager
{
    constructor()
    {
        this.entityHandler = new EntityHandler(this);
        this.componentHandler = new ComponentHandler(this);
    }

    clear()
    {
        for(let entityId of this.entityHandler.getEntityIds())
        {
            this.destroyEntity(entityId, opts);
        }
    }

    /** Creates a unique entity with passed-in components (without initial values). */
    createEntity(...components)
    {
        const entityId = this.entityHandler.getNextAvailableEntityId();
        this.entityHandler.addEntityId(entityId);

        for(let component of components)
        {
            this.addComponent(entityId, component);
        }
        return entityId;
    }

    /** Destroys the passed-in entity (and its components). */
    destroyEntity(entityId)
    {
        // Remove entity components from world
        for(let componentType of this.componentHandler.getComponentTypes())
        {
            if (this.componentHandler.getComponentInstanceMapByType(componentType).has(entityId))
            {
                this.removeComponent(entityId, componentType);
            }
        }

        // Remove entity from world
        this.entityHandler.deleteEntityId(entityId);
    }

    getEntityIds()
    {
        return this.entityHandler.getEntityIds();
    }
    
    /**
     * 
     * @param {import('./Entity.js').EntityId} entityId The id of the entity to add to.
     * @param {FunctionConstructor|import('./Component.js').ComponentFactory|String|Number} componentType The component type.
     * Can either be a component class or a component factory.
     * @param {Object} [initialValues] The initial values for the component. Can be an object
     * map of all defined key-value pairs or another instance of the same component. This
     * must be undefined for tag-like components.
     */
    addComponent(entityId, componentType, initialValues = undefined)
    {
        try
        {
            let component = this.componentHandler.createComponent(entityId, componentType, initialValues);
            this.componentHandler.putComponent(entityId, componentType, component, initialValues);
            return component;
        }
        catch(e)
        {
            console.error(`Failed to add component '${getComponentTypeName(componentType)}' to entity '${entityId}'.`);
            console.error(e);
        }
    }

    removeComponent(entityId, componentType)
    {
        try
        {
            let component = this.getComponent(entityId, componentType);
            this.componentHandler.deleteComponent(entityId, componentType, component);
        }
        catch(e)
        {
            console.error(`Failed to remove component '${getComponentTypeName(componentType)}' from entity '${entityId}'.`);
            console.error(e);
        }
    }

    clearComponents(entityId)
    {
        for(let entityComponentMap of this.componentHandler.getComponentInstanceMaps())
        {
            if (entityComponentMap.has(entityId))
            {
                let component = entityComponentMap.get(entityId);
                this.componentHandler.deleteComponent(entityId, componentType, component);
            }
        }
    }

    getComponent(entityId, componentType)
    {
        return this.componentHandler.getComponentInstanceMapByType(componentType).get(entityId);
    }

    hasComponent(entityId, ...componentTypes)
    {
        for(let componentType of componentTypes)
        {
            if (!this.componentHandler.hasComponentType(componentType)) return false;
            if (!this.componentHandler.getComponentInstanceMapByType(componentType).has(entityId)) return false;
        }
        return true;
    }

    countComponents(entityId)
    {
        let count = 0;
        for(let entityComponentMap of this.componentHandler.getComponentInstanceMaps())
        {
            if (entityComponentMap.has(entityId))
            {
                ++count;
            }
        }
        return count;
    }

    /**
     * Immediately query entity ids by its components. This is simply an alias for Query.select().
     * @param {Array<Component>} components The component list to match entities to.
     * @returns {Iterable<EntityId>} A collection of all matching entity ids.
     */
    query(components)
    {
        return EntityQuery.select(this, components);
    }

    [Symbol.iterator]()
    {
        return this.getEntityIds()[Symbol.iterator]();
    }
}
