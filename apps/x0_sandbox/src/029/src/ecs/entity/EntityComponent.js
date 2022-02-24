import { EntityComponentFactory } from './EntityComponentFactory.js';

const COMPONENT_TYPE = Symbol('componentType');

function createEntityComponentType(entityManager, entityConstructor)
{
    const result = Symbol(entityConstructor.name);
    entityManager.components.registerComponent(result, new EntityComponentFactory());
    return result;
}

export class EntityComponent
{
    static get type()
    {
        let result = this[COMPONENT_TYPE];
        if (!result)
        {
            result = Symbol(this.name);
            Object.defineProperty(this, COMPONENT_TYPE, { value: result });
        }
        return result;
    }

    constructor(entityManager, entityId = undefined)
    {
        entityId = entityManager.createEntity(entityId);

        let componentType = this.constructor.type;
        if (!componentType)
        {
            componentType = createEntityComponentType(entityManager);
        }
        let component = entityManager.addComponent(entityId, componentType);
        component.ref = this;

        this.entityManager = entityManager;
        this.entityId = entityId;
    }
}
