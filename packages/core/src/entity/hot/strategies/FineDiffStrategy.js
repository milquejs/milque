import { EntityManager } from '../../EntityManager.js';
import { computeDiff, applyDiff } from '../../../diff/Diff.js';

/**
 * Performs a fine diff on the entities and reconciles any changes with the current world state.
 * It respects the current world state with higher precedence over the modified changes. In other
 * words, any properties modified by the running program will be preserved. Only properties that
 * have not changed will be modified to reflect the new changes.
 * 
 * This assumes entity constructors are deterministic, non-reflexive, and repeatable in a blank
 * test world.
 * 
 * @param {HotEntityModule} prevHotEntityModule The old source hot entity module instance.
 * @param {HotEntityModule} nextHotEntityModule The new target hot entity module instance.
 * @param {Object} [opts] Any additional options.
 * @param {Function} [opts.worldObjectWrapper] If defined, the function will allow you wrap the create EntityManager
 * and specify the shape of the "world" parameter given to the entity constructors. The function takes in an instance
 * of EntityManager and returns an object to pass to the constructors.
 */
export function FineDiffStrategy(prevHotEntityModule, nextHotEntityModule, opts = undefined)
{
    const prevEntityConstructor = prevHotEntityModule.entityConstructor;
    const prevEntityManagers = prevHotEntityModule.entityManagers;
    const nextEntityConstructor = nextHotEntityModule.entityConstructor;
    const nextEntityManagers = nextHotEntityModule.entityManagers;

    let cacheEntityManager = new EntityManager();
    let cacheWorld = (opts && opts.worldObjectWrapper)
        ? opts.worldObjectWrapper(cacheEntityManager)
        : cacheEntityManager;
    let oldEntity = prevEntityConstructor(cacheWorld);
    let newEntity = nextEntityConstructor(cacheWorld);

    // Diff the old and new components...only update what has changed...
    let componentValues = new Map();
    for(let componentType of cacheEntityManager.getComponentTypesByEntityId(newEntity))
    {
        let newComponent = cacheEntityManager.getComponent(newEntity, componentType);
        let oldComponent = cacheEntityManager.getComponent(oldEntity, componentType);

        if (!oldComponent)
        {
            // ...it's an addition!
            componentValues.set(componentType, true);
        }
        else
        {
            // ...it's an update!
            let result = computeDiff(oldComponent, newComponent);
            componentValues.set(componentType, result);
        }
    }
    for(let componentType of cacheEntityManager.getComponentTypesByEntityId(oldEntity))
    {
        if (!componentValues.has(componentType))
        {
            // ...it's a deletion!
            componentValues.set(componentType, false);
        }
    }

    // Clean up cache entity manager...
    cacheEntityManager.clear();

    // Update all existing entity managers to the new entities...
    for(let entityManager of prevEntityManagers)
    {
        // Update entities...
        for(let entity of prevHotEntityModule.entities.get(entityManager).values())
        {
            for(let [componentType, values] of componentValues.entries())
            {
                if (typeof values === 'boolean')
                {
                    if (values)
                    {
                        // Addition!
                        entityManager.addComponent(entity, componentType);
                    }
                    else
                    {
                        // Deletion!
                        entityManager.removeComponent(entity, componentType);
                    }
                }
                else
                {
                    // Update!
                    let component = entityManager.getComponent(entity, componentType);
                    applyDiff(component, values);
                }
            }
        }
    }
}
