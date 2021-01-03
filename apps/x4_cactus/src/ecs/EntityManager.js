import { ComponentRegistry } from './ComponentRegistry.js';

function validateEntityId(entityId)
{
    let t = typeof entityId;
    if (t !== 'number' || !Number.isSafeInteger(entityId))
    {
        throw new Error('Entity id must be a valid and safe integer.');
    }
}

export class EntityManager
{
    constructor(opts = {})
    {
        const {
            components = new ComponentRegistry(),
            debug = true
        } = opts;

        this.components = components;
        this.entities = new Set();

        this.debug = debug;
        /** @private */
        this.nextAvailableEntityId = 1;
        /** @private */
        this.listeners = {};
    }

    addEventListener(event, listener)
    {
        let array = this.listeners[event];
        if (array)
        {
            array.push(listener);
        }
        else
        {
            this.listeners[event] = [listener];
        }
    }

    removeEventListener(event, listener)
    {
        let array = this.listeners[event];
        if (array)
        {
            let i = array.indexOf(listener);
            if (i >= 0)
            {
                array.splice(i, 1);
            }
        }
    }

    createEntity(entityId = this.nextAvailableEntityId++)
    {
        if (this.debug)
        {
            validateEntityId(entityId);
        }

        this.entities.add(entityId);
        return entityId;
    }

    deleteEntity(entityId)
    {
        if (this.debug)
        {
            validateEntityId(entityId);
        }
        
        for(let componentType of this.components.getComponentTypes())
        {
            this.removeComponent(entityId, componentType);
        }
        this.entities.delete(entityId);
    }

    getEntities()
    {
        return this.entities;
    }

    clearEntities()
    {
        this.entities.clear();
    }

    addComponent(entityId, componentType)
    {
        if (this.debug)
        {
            validateEntityId(entityId);

            if (!this.components.isComponentType(componentType))
            {
                throw new Error(`Component '${componentType}' does not have a registered factory.`);
            }

            if (!this.entities.has(entityId))
            {
                throw new Error(`Entity '${entityId}' is not created.`);
            }
        }

        let factory = this.components.getComponentFactory(componentType);
        factory.create(entityId);
        return factory.get(entityId);
    }

    removeComponent(entityId, componentType)
    {
        let factory = this.components.getComponentFactory(componentType);
        let component = factory.get(entityId);
        if (component)
        {
            factory.delete(entityId);
            return true;
        }
        return false;
    }

    getComponent(entityId, componentType)
    {
        let factory = this.components.getComponentFactory(componentType);
        return factory.get(entityId);
    }

    hasComponent(entityId, componentType)
    {
        let factory = this.components.getComponentFactory(componentType);
        return factory && factory.has(entityId);
    }
}
