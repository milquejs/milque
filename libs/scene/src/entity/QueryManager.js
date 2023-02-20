import { ComponentClass } from './ComponentClass';

/** @typedef {import('./EntityManager').EntityManager} EntityManager */
/** @typedef {import('./EntityManager').EntityId} EntityId */

/**
 * @template T
 * @typedef {import('./Query').Query<T>} Query<T>
 */

export class QueryManager {

    constructor() {
        /**
         * @protected
         * @type {Record<string, Array<EntityId>>}
         */
        this.cachedResults = {};
        /**
         * @private
         * @type {Record<string, Query<?>>}
         */
        this.keyQueryMapping = {};

        this.onEntityComponentChanged = this.onEntityComponentChanged.bind(this);
    }

    /**
     * @param {EntityManager} entityManager
     * @param {EntityId} entityId
     * @param {ComponentClass<?>} added
     * @param {ComponentClass<?>} removed
     * @param {boolean} dead
     */
    onEntityComponentChanged(entityManager, entityId, added, removed, dead) {
        for(let query of Object.values(this.keyQueryMapping)) {
            let entities = this.cachedResults[query.key];
            if (dead) {
                let i = entities.indexOf(entityId);
                if (i >= 0) {
                    entities.splice(i, 1);
                }
            } else if (added) {
                if (query.hasSelector(Not(added))) {
                    let i = entities.indexOf(entityId);
                    if (i >= 0) {
                        entities.splice(i, 1);
                    }
                } else if (query.hasSelector(added) && query.test(entityManager, entityId)) {
                    let i = entities.indexOf(entityId);
                    if (i < 0) {
                        entities.push(entityId);
                    }
                }
            } else if (removed) {
                if (query.hasSelector(Not(removed)) && query.test(entityManager, entityId)) {
                    let i = entities.indexOf(entityId);
                    if (i < 0) {
                        entities.push(entityId);
                    }
                } else if (query.hasSelector(removed) && query.test(entityManager, entityId)) {
                    let i = entities.indexOf(entityId);
                    if (i >= 0) {
                        entities.splice(i, 1);
                    }
                }
            }
        }
    }

    /**
     * @param {EntityManager} entityManager
     * @param {Query<?>} query 
     * @returns {EntityId}
     */
    findAny(entityManager, query) {
        let result = this.findAll(entityManager, query);
        if (result.length <= 0) {
            return null;
        } else {
            return result[Math.floor(Math.random() * result.length)];
        }
    }

    /**
     * @param {EntityManager} entityManager
     * @param {Query<?>} query
     * @returns {Array<EntityId>}
     */
    findAll(entityManager, query) {
        const queryKey = query.key;
        let result;
        if (!(queryKey in this.keyQueryMapping)) {
            result = [];
            this.keyQueryMapping[queryKey] = query;
            this.cachedResults[queryKey] = result;
            query.hydrate(entityManager, result);
        } else {
            result = this.cachedResults[queryKey];
        }
        return result;
    }

    /**
     * @param {EntityManager} entityManager
     * @param {Query<?>} query 
     */
    count(entityManager, query) {
        let result = this.findAll(entityManager, query);
        return result.length;
    }

    /**
     * @param {Query<?>} query
     */
    clear(query) {
        const queryKey = query.key;
        if (!(queryKey in this.keyQueryMapping)) {
            return;
        }
        delete this.keyQueryMapping[queryKey];
        delete this.cachedResults[queryKey];
    }
    
    reset() {
        this.keyQueryMapping = {};
        this.cachedResults = {};
    }
}

/**
 * @template T
 * @typedef {SelectorNot<T>|ComponentClass<T>} Selector<T>
 */

/**
 * @template T
 * @typedef SelectorNot<T>
 * @property {'not'} type
 * @property {string} name
 * @property {ComponentClass<T>} value
 */

/**
 * @template T
 * @param {ComponentClass<T>} componentClass 
 * @returns {ComponentClass<T>}
 */
export function Not(componentClass) {
    return {
        // @ts-ignore
        type: 'not',
        name: componentClass.name,
        value: componentClass,
    };
}

export function isSelectorNot(selector) {
    return 'type' in selector && selector.type === 'not';
}
