import { EntityManager } from './EntityManager';
import { ComponentClass } from './ComponentClass';

/** @typedef {import('./EntityManager').EntityId} EntityId */

/**
 * @template {ComponentClass<any>[]} T
 * @typedef {{[K in keyof T]: T[K] extends ComponentClass<infer V> ? V : never}} ComponentInstancesOf<T>
 */

/**
 * @template {ComponentClass<any>[]} T
 */
export class EntityTemplate {
    /**
     * @param {T} componentClasses 
     */
    constructor(...componentClasses) {
        /** @private */
        this.componentClasses = componentClasses;
    }

    /**
     * @param {EntityManager} entityManager
     * @returns {[EntityId, ...ComponentInstancesOf<T>]}
     */
    create(entityManager) {
        let entityId = entityManager.create();
        let result = /** @type {[EntityId, ...ComponentInstancesOf<T>]} */ (/** @type {unknown} */ ([entityId]));
        for (let componentClass of this.componentClasses) {
            let instance = entityManager.attach(entityId, componentClass);
            result.push(instance);
        }
        return result;
    }

    /**
     * @param {EntityManager} entityManager 
     * @param {EntityId} entityId 
     */
    destroy(entityManager, entityId) {
        for (let componentClass of this.componentClasses) {
            entityManager.detach(entityId, componentClass);
        }
    }
}
