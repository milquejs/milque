import { ComponentClass } from './ComponentClass';
import { EntityManager } from './EntityManager';
import { Query } from './Query';
import { isSelectorNot } from './QueryManager';

/**
 * @typedef {Record<string, ComponentClass<any>>} ArchetypeComponentMap
 */

/**
 * @template {ArchetypeComponentMap} T
 * @typedef {{[K in keyof T]: T[K] extends ComponentClass<infer V> ? V : never}} ArchetypeComponentInstancesOf<T>
 */

/**
 * @template {ArchetypeComponentMap} T
 */
export class Archetype extends Query {

    /**
     * @param {T} components 
     */
    constructor(components) {
        super(...Object.values(components));
        this.components = components;
    }

    /**
     * @param {EntityManager} ents 
     * @returns {ArchetypeComponentInstancesOf<T>}
     */
    create(ents) {
        let entityId = ents.create();
        let result = {};
        for(let [key, componentClass] of Object.entries(this.components)) {
            let instance = ents.attach(entityId, componentClass);
            result[key] = instance;
        }
        return /** @type {ArchetypeComponentInstancesOf<T>} */ (result);
    }

    /**
     * @param {EntityManager} ents 
     * @param {import('./EntityManager').EntityId} entityId 
     */
    destroy(ents, entityId) {
        for (let componentClass of Object.values(this.components)) {
            ents.detach(entityId, componentClass);
        }
    }

    /**
     * @param {EntityManager} ents 
     * @param {import('./EntityManager').EntityId} entityId
     * @returns {ArchetypeComponentInstancesOf<T>}
     */
    find(ents, entityId) {
        if (entityId === null) {
            return /** @type {ArchetypeComponentInstancesOf<T>} */ ({});
        }
        return computeResult({}, ents, entityId, this.components);
    }

    /**
     * @param {EntityManager} ents 
     * @returns {ArchetypeComponentInstancesOf<T>}
     */
    findAny(ents) {
        const queryManager = ents.queries;
        let entities = queryManager.findAll(ents, this);
        if (entities.length <= 0) {
            return /** @type {ArchetypeComponentInstancesOf<T>} */ ({});
        }
        let entityId = entities[Math.floor(Math.random() * entities.length)];
        return computeResult({}, ents, entityId, this.components);
    }

    /**
     * @param {EntityManager} ents 
     * @returns {Generator<ArchetypeComponentInstancesOf<T>>}
     */
    *findAll(ents) {
        const queryManager = ents.queries;
        let result = {};
        let entities = queryManager.findAll(ents, this);
        for(let entityId of entities) {
            yield computeResult(result, ents, entityId, this.components);
        }
    }
}

/**
 * @template T
 * @param {object} out 
 * @param {EntityManager} ents 
 * @param {import('./EntityManager').EntityId} entityId 
 * @param {T} componentClasses
 * @returns {ArchetypeComponentInstancesOf<T>}
 */
function computeResult(out, ents, entityId, componentClasses) {
    for(let [key, componentClass] of Object.entries(componentClasses)) {
        if (isSelectorNot(componentClass)) {
            out[key] = null;
        } else {
            out[key] = ents.get(entityId, componentClass);
        }
    }
    return out;
}
