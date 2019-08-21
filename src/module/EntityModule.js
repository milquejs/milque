import EntityBase from '../entity/EntityBase.js';
import EntityManager from '../entity/EntityManager.js';

const ENTITY_MANAGER = new EntityManager();

/**
 * Spawns an entity of the class type. This serves as the hybrid ECS / MVC entity.
 * The returned value can be treated as the entity object itself and any manipulations
 * should be handled through that object. Implementation-wise, the created instance is
 * treated as a component (with fancy callbacks) and therefore can easily interoperate
 * with other components while being able to own its data and logic. In other words,
 * you can easily substitute a Component with a EntityClass for any component function,
 * including entitites(), has(), etc.
 * 
 * NOTE: Because references to this instance may exist AFTER it has been destroyed, it
 * is NOT recommended to destroy() or remove() "class" components from the manager.
 * Instead, it should be done through the entity itself, and therefore the user will
 * at least SEE the destruction and take action in removing it manually.
 * 
 * @param {Class<EntityBase>} EntityClass The class of the entity to create.
 * @param  {...any} args Any additional arguments to pass to the entity's create().
 * @returns {EntityBase} The handler component for the entity.
 */
function spawn(EntityClass = EntityBase, ...args)
{
    const entity = ENTITY_MANAGER.create();
    return ENTITY_MANAGER.assign(entity, EntityClass, this, entity, ...args);
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