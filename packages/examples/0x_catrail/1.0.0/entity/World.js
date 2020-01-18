import { Eventable } from '../milque.js';

import { Query } from './Query.js';
import { getComponentTypeName } from './component/ComponentHelper.js';
import { EntityManager } from './EntityManager.js';
import { ComponentManager } from './ComponentManager.js';

/**
 * @typedef EntityId
 * The unique id for every entity in a world.
 */

/**
 * Manages all entities.
 * 
 * @fires World#entitycreate
 * @fires World#entitydestroy
 * @fires World#componentadd
 * @fires World#componentremove
 */
export class World
{
    constructor()
    {
        this.entityManager = new EntityManager(this);
        this.componentManager = new ComponentManager(this);
    }

    clear()
    {
        for(let entityId of this.entityManager.getEntityIds())
        {
            this.destroyEntity(entityId, opts);
        }
    }

    /** Creates a unique entity with passed-in components (without initial values). */
    createEntity(...components)
    {
        const entityId = this.entityManager.getNextAvailableEntityId();
        this.entityManager.addEntityId(entityId);

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
        for(let componentType of this.componentManager.getComponentTypes())
        {
            if (this.componentManager.getEntityComponentMap(componentType).has(entityId))
            {
                this.removeComponent(entityId, componentType);
            }
        }

        // Remove entity from world
        this.entityManager.deleteEntityId(entityId);
    }

    getEntityIds()
    {
        return this.entityManager.getEntityIds();
    }
    
    /**
     * 
     * @param {import('./Entity.js').EntityId} entityId The id of the entity to add to.
     * @param {FunctionConstructor|import('./Component.js').ComponentFactory|String|Number} componentClass The component type.
     * Can either be a component class or a component factory.
     * @param {Object} [initialValues] The initial values for the component. Can be an object
     * map of all defined key-value pairs or another instance of the same component. This
     * must be undefined for tag-like components.
     */
    addComponent(entityId, componentClass, initialValues = undefined)
    {
        try
        {
            let component = this.componentManager.createComponent(entityId, componentClass, initialValues);
            this.componentManager.putComponent(entityId, componentClass, component, initialValues);
            return component;
        }
        catch(e)
        {
            console.error(`Failed to add component '${getComponentTypeName(componentClass)}' to entity '${entityId}'.`);
            console.error(e);
        }
    }

    removeComponent(entityId, componentClass)
    {
        try
        {
            let component = this.getComponent(entityId, componentClass);
            this.componentManager.deleteComponent(entityId, componentClass, component);
        }
        catch(e)
        {
            console.error(`Failed to remove component '${getComponentTypeName(componentClass)}' from entity '${entityId}'.`);
            console.error(e);
        }
    }

    clearComponents(entityId)
    {
        for(let entityComponentMap of this.componentManager.getEntityComponentMaps())
        {
            if (entityComponentMap.has(entityId))
            {
                let component = entityComponentMap.get(entityId);
                this.componentManager.deleteComponent(entityId, componentClass, component);
            }
        }
    }

    getComponent(entityId, componentType)
    {
        return this.componentManager.getEntityComponentMap(componentType).get(entityId);
    }

    hasComponent(entityId, ...componentTypes)
    {
        for(let componentType of componentTypes)
        {
            if (!this.componentManager.hasComponentType(componentType)) return false;
            if (!this.componentManager.getEntityComponentMap(componentType).has(entityId)) return false;
        }
        return true;
    }

    countComponents(entityId)
    {
        let count = 0;
        for(let entityComponentMap of this.componentManager.getEntityComponentMaps())
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
        return Query.select(this, components);
    }
};
Eventable.mixin(World);
