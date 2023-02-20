import { ComponentClass } from './ComponentClass';
import { EntityManager } from './EntityManager';
import { isSelectorNot } from './QueryManager';

/** @typedef {import('./EntityManager').EntityId} EntityId */

/**
 * @template T
 * @typedef {import('./QueryManager').Selector<T>} Selector<T>
 */

/**
 * @template T
 * @typedef {import('./QueryManager').SelectorNot<T>} SelectorNot<T>
 */

/**
 * @template T
 * @typedef {import('./EntityTemplate').ComponentInstancesOf<T>} ComponentInstancesOf<T>
 */

/**
 * @template {ComponentClass<any>[]} T
 */
export class Query {

    /**
     * @param {T} selectors 
     */
    constructor(...selectors) {
        this.selectors = selectors;
        this.key = selectors.map(s => isSelectorNot(s) ? `!${s.name}` : s.name).sort().join('&');
    }

    /**
     * @param {Selector<?>} selector
     */
    hasSelector(selector) {
        if (isSelectorNot(selector)) {
            return this.selectors.findIndex(v => isSelectorNot(v) && v.name === selector.name) >= 0;
        } else {
            return this.selectors.findIndex(v => v.name === selector.name) >= 0;
        }
    }

    /**
     * @param {EntityManager} entityManager 
     * @param {EntityId} entityId
     */
    test(entityManager, entityId) {
        for(let selector of this.selectors) {
            if (isSelectorNot(selector)) {
                const componentClass = /** @type {SelectorNot<?>} */ (/** @type {unknown} */ (selector)).value;
                if (entityManager.exists(entityId, componentClass)) {
                    return false;
                }
            } else {
                const componentClass = /** @type {ComponentClass<?>} */ (/** @type {unknown} */ (selector));
                if (!entityManager.exists(entityId, componentClass)) {
                    return false;
                }
            }
        }
        return true;
    }

    /**
     * @param {EntityManager} entityManager
     * @param {Array<EntityId>} result 
     */
    hydrate(entityManager, result) {
        if (this.selectors.length <= 0) {
            result.length = 0;
            return result;
        }
        let entities = entityManager.entityIds();
        for(let entityId of entities) {
            if (this.test(entityManager, entityId)) {
                result.push(entityId);
            }
        }
        return result;
    }
    
    /**
     * @param {EntityManager} entityManager 
     * @returns {number}
     */
    count(entityManager) {
        return entityManager.queryManager.count(entityManager, this);
    }

    /**
     * @param {EntityManager} entityManager 
     * @returns {[EntityId, ...ComponentInstancesOf<T>]}
     */
    findAny(entityManager) {
        const queryManager = entityManager.queryManager;
        let result = /** @type {[EntityId, ...ComponentInstancesOf<T>]} */ (new Array(this.selectors.length + 1));
        let entityId = queryManager.findAny(entityManager, this);
        if (entityId === null) {
            return result.fill(undefined);
        }
        computeResult(result, entityManager, entityId, this.selectors);
        return result;
    }

    /**
     * @param {EntityManager} entityManager 
     * @returns {Generator<[EntityId, ...ComponentInstancesOf<T>]>}
     */
    *findAll(entityManager) {
        const queryManager = entityManager.queryManager;
        let result = /** @type {[EntityId, ...ComponentInstancesOf<T>]} */ (new Array(this.selectors.length + 1));
        let entities = queryManager.findAll(entityManager, this);
        for(let entityId of entities) {
            computeResult(result, entityManager, entityId, this.selectors);
            yield result;
        }
    }
}

/**
 * @template {ComponentClass<any>[]} T
 * @param {[EntityId, ...ComponentInstancesOf<T>]} out
 * @param {EntityManager} entityManager  
 * @param {EntityId} entityId
 * @param {T} selectors
 * @returns {[EntityId, ...ComponentInstancesOf<T>]}
 */
function computeResult(out, entityManager, entityId, selectors) {
    out[0] = entityId;
    let i = 1;
    for(let selector of selectors) {
        if (isSelectorNot(selector)) {
            out[i] = null;
        } else {
            out[i] = entityManager.get(entityId, selector);
        }
        ++i;
    }
    return out;
}
