import EntityBase from '../entity/EntityBase.js';
import EntityManager from '../entity/EntityManager.js';

const ENTITY_MANAGER = new EntityManager();

/**
 * @param {Class} EntityClass A sub-class of EntityBase.
 * @returns {EntityBase} The created entity instance of passed-in class.
 */
function spawn(EntityClass = EntityBase)
{
    const result = new EntityClass(ENTITY_MANAGER);
    return result.create();
}

function keys(...components)
{
    return ENTITY_MANAGER.entities(...components);
}

function component(entity, component, ...components)
{
    return ENTITY_MANAGER.get(entity, component, ...components);
}

export {
    ENTITY_MANAGER,
    EntityBase,
    spawn,
    keys,
    component,
};