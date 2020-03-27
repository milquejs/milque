import { FineDiffStrategy } from './strategies/FineDiffStrategy.js';

export class HotEntityModule
{
    constructor(entityModule, entityConstructor)
    {
        this.moduleId = entityModule.id;
        this.entityConstructor = entityConstructor;

        this.entities = new Map();
    }

    addEntity(entityManager, entityId)
    {
        if (this.entities.has(entityManager))
        {
            this.entities.get(entityManager).add(entityId);
        }
        else
        {
            let entitySet = new Set();
            entitySet.add(entityId);
            this.entities.set(entityManager, entitySet);
        }

        // Add listener...
        entityManager.entityHandler.addEntityListener(
            entityId,
            'destroy',
            this.removeEntity.bind(this, entityManager, entityId),
            { handle: `${this.moduleId}:${entityId}` }
        );
    }

    removeEntity(entityManager, entityId)
    {
        // Remove listener...(just in case this was not triggered by a destroy event)...
        entityManager.entityHandler.removeEntityListener(
            entityId,
            'destroy',
            `${this.moduleId}:${entityId}`);
        
        let entitySet = this.entities.get(entityManager);
        entitySet.delete(entityId);
        if (entitySet.size <= 0) this.entities.delete(entityManager);
    }

    /**
     * Replaces the current state of with the next one. This includes all entities and entity managers.
     * However, it assumes both hot entity replacements are for the same module.
     * 
     * @param {HotEntityModule} nextHotEntityModule The new hot entity module object to replace this with.
     * @param {Object} [opts] Any additional options.
     * @param {Function} [opts.replaceStrategy] If defined, replacement will be handled by the passed in
     * function. It takes 3 arguemtns: the hot entity replacement instance, the target instance, and the replaceOpts if defined.
     * @param {Object} [opts.replaceOpts] This is given to the replacement strategy function, if defined.
     */
    replaceWith(nextHotEntityModule, opts = undefined)
    {
        // NOTE: Assumes more than one instance can exist at the same time.
        // NOTE: Assumes components do not store self references (nor their own entity id).
        // NOTE: Assumes you don't use objects in sets (unless they are immutable)...cause those are evil.

        const replaceStrategy = (opts && opts.replaceStrategy) || FineDiffStrategy;
        replaceStrategy.call(
            undefined,
            this,
            nextHotEntityModule,
            opts && opts.replaceOpts,
        );

        // Copy the new constructor over...
        this.entityConstructor = nextHotEntityModule.entityConstructor;

        // Copy any new entities over...
        for(let entityManager of nextHotEntityModule.entityManagers)
        {
            for(let entity of nextHotEntityModule.entities.get(entityManager).values())
            {
                nextHotEntityModule.removeEntity(entityManager, entity);
                this.addEntity(entityManager, entity);
            }
        }
    }

    isEmpty()
    {
        return this.entities.size <= 0;
    }

    get entityManagers()
    {
        return this.entities.keys();
    }
}
