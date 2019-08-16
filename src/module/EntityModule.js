import EntityBase from '../entity/EntityBase.js';
import EntityManager from '../entity/EntityManager.js';

const ENTITY_MANAGER = new EntityManager();

function spawn(EntityClass = EntityBase, ...args)
{
    return ENTITY_MANAGER.spawn(EntityClass, ...args);
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