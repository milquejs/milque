import EntityBase from '../entity/EntityBase.js';
import EntityManager from '../entity/EntityManager.js';
import EntityView from '../entity/EntityView.js';

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
    const entityID = ENTITY_MANAGER.create();
    return ENTITY_MANAGER.assign(entityID, EntityClass, ENTITY_MANAGER, entityID, ...args);
}

function entities(...components)
{
    return {
        view: new EntityView(ENTITY_MANAGER, (entity) => ENTITY_MANAGER.has(entity, EntityBase, ...components)),
        [Symbol.iterator]()
        {
            return {
                iterator: this.view[Symbol.iterator](),
                next()
                {
                    let result = this.iterator.next();
                    if (!result.done)
                    {
                        return {
                            value: ENTITY_MANAGER.get(result.value, EntityBase),
                            done: false
                        };
                    }
                    else
                    {
                        return { done: true };
                    }
                }
            }
        }
    }
}

function components(...components)
{
    return {
        view: new EntityView(ENTITY_MANAGER, (entity) => ENTITY_MANAGER.has(entity, ...components)),
        [Symbol.iterator]()
        {
            return {
                iterator: this.view[Symbol.iterator](),
                next()
                {
                    let result = this.iterator.next();
                    if (!result.done)
                    {
                        return {
                            value: ENTITY_MANAGER.get(result.value, ...components),
                            done: false
                        };
                    }
                    else
                    {
                        return { done: true };
                    }
                }
            }
        }
    }
}

export {
    ENTITY_MANAGER,
    EntityBase,
    spawn,
    entities,
    components
};