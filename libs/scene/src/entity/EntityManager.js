import { ComponentClass } from './ComponentClass';
import { QueryManager } from './QueryManager';

/**
 * @template T
 * @typedef {Record<number, T>} ComponentInstanceMap<T>
 */

/**
 * @typedef {Record<string, ComponentInstanceMap<?>>} ComponentClassMap
 * @typedef {number} EntityId
 * @typedef {string} ComponentName
 */

/**
 * @callback EntityComponentChangedCallback
 * @param {EntityManager} entityManager
 * @param {EntityId} entityId
 * @param {ComponentClass<?>} attached
 * @param {ComponentClass<?>} detached
 * @param {boolean} dead
 */

export class EntityManager {

    constructor() {
        /**
         * @protected
         * @type {ComponentClassMap}
         */
        this.components = {};
        /** @private */
        this.nameClassMapping = {};
        /**
         * @private
         * @type {EntityId}
         */
        this.nextAvailableEntityId = 1;
        /**
         * @protected
         * @type {Array<[string, ...any]>}
         */
        this.queue = [];
        /** @private */
        this.listeners = [];
        this.queries = new QueryManager();
    }

    /**
     * @protected
     * @param {EntityId} entityId
     * @param {ComponentClass<?>} attached
     * @param {ComponentClass<?>} detached
     * @param {boolean} dead
     */
    entityComponentChangedCallback(entityId, attached, detached, dead) {
        this.queries.onEntityComponentChanged(this, entityId, attached, detached, dead);
        for(let callback of this.listeners) {
            callback(this, entityId, attached, detached, dead);
        }
    }

    /**
     * @param {'change'} event 
     * @param {EntityComponentChangedCallback} callback 
     */
    addEventListener(event, callback) {
        if (event === 'change') {
            this.listeners.push(callback);
        }
    }

    /**
     * @param {'change'} event 
     * @param {EntityComponentChangedCallback} callback 
     */
    removeEventListener(event, callback) {
        if (event === 'change') {
            let i = this.listeners.indexOf(callback);
            if (i >= 0) {
                this.listeners.splice(i, 1);
            }
        }
    }

    flush() {
        while (this.queue.length > 0) {
            let [type, ...args] = this.queue.shift();
            switch (type) {
                case 'attach': {
                    let [entityId, componentClass, instance] = args;
                    this.attachImmediately(entityId, componentClass, instance);
                } break;
                case 'detach': {
                    let [entityId, componentClass] = args;
                    this.detachImmediately(entityId, componentClass);
                } break;
                case 'clear': {
                    let [componentClass] = args;
                    this.clearImmediately(componentClass);
                } break;
            }
        }
    }

    /**
     * @returns {EntityId}
     */
    create() {
        let entityId = this.nextAvailableEntityId++;
        this.entityComponentChangedCallback(entityId, null, null, false);
        return entityId;
    }

    /**
     * @param {EntityId} entityId 
     */
    destroy(entityId) {
        const components = this.components;
        for (const componentName of Object.keys(components)) {
            const instanceMap = components[componentName];
            if (entityId in instanceMap) {
                delete instanceMap[entityId];
                this.entityComponentChangedCallback(entityId, null, this.nameClassMapping[componentName], false);
            }
        }
        this.entityComponentChangedCallback(entityId, null, null, true);
    }

    /**
     * Whether the entity exists with all provided component classes.
     * 
     * @param {EntityId} entityId 
     * @param {...ComponentClass<?>} componentClasses
     */
    exists(entityId, ...componentClasses) {
        if (componentClasses.length > 0) {
            for(const componentClass of componentClasses) {
                let instanceMap = this.mapOf(componentClass);
                if (!(entityId in instanceMap)) {
                    return false;
                }
            }
            return true;
        } else {
            for (let instanceMap of Object.values(this.components)) {
                if (entityId in instanceMap) {
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * @template T
     * @param {EntityId} entityId 
     * @param {ComponentClass<T>} componentClass
     * @param {T} [instance]
     * @returns {T}
     */
    attach(entityId, componentClass, instance = undefined) {
        if (typeof instance === 'undefined') {
            instance = componentClass.new();
        }
        this.queue.push(['attach', entityId, componentClass, instance]);
        return instance;
    }

    /**
     * @template T
     * @param {EntityId} entityId 
     * @param {ComponentClass<T>} componentClass 
     * @param {T} [instance]
     * @returns {T}
     */
    attachImmediately(entityId, componentClass, instance = undefined) {
        if (typeof instance === 'undefined') {
            instance = componentClass.new();
        }
        let instanceMap = this.mapOf(componentClass);
        instanceMap[entityId] = instance;
        this.entityComponentChangedCallback(entityId, componentClass, null, false);
        return instance;
    }

    /**
     * @template T
     * @param {EntityId} entityId 
     * @param {ComponentClass<T>} componentClass
     */
    detach(entityId, componentClass) {
        this.queue.push(['detach', entityId, componentClass]);
    }

    /**
     * @template T
     * @param {EntityId} entityId 
     * @param {ComponentClass<T>} componentClass 
     */
    detachImmediately(entityId, componentClass) {
        let instanceMap = this.mapOf(componentClass);
        let instance = instanceMap[entityId];
        delete instanceMap[entityId];
        componentClass.delete(instance);
        this.entityComponentChangedCallback(entityId, null, componentClass, false);
    }

    /**
     * @param {ComponentClass<?>} componentClass 
     */
    clear(componentClass) {
        this.queue.push(['clear', componentClass]);
    }

    /**
     * @param {ComponentClass<any>} componentClass 
     */
    clearImmediately(componentClass) {
        const componentName = componentClass.name;
        const components = this.components;
        const instanceMap = components[componentName];
        let entities = Object.keys(instanceMap).map(Number);
        let instances = Object.values(instanceMap);
        components[componentName] = {};
        this.nameClassMapping[componentName] = componentClass;
        for(let instance of instances) {
            componentClass.delete(instance);
        }
        for(let entityId of entities) {
            this.entityComponentChangedCallback(entityId, null, componentClass, false);
        }
    }

    /**
     * @template T
     * @param {EntityId} entityId 
     * @param {ComponentClass<T>} componentClass 
     * @returns {T}
     */
    get(entityId, componentClass) {
        return this.mapOf(componentClass)[entityId] || null;
    }

    /**
     * @param {ComponentClass<?>} componentClass 
     * @returns {number}
     */
    count(componentClass) {
        return Object.keys(this.mapOf(componentClass)).length;
    }

    /**
     * @param {ComponentClass<?>} componentClass
     */
    keysOf(componentClass) {
        return Object.keys(this.mapOf(componentClass)).map(Number);
    }

    /**
     * @template T
     * @param {ComponentClass<T>} componentClass 
     * @returns {Array<T>}
     */
    valuesOf(componentClass) {
        return Object.values(this.mapOf(componentClass));
    }

    /**
     * @protected
     * @template T
     * @param {ComponentClass<T>} componentClass
     * @returns {ComponentInstanceMap<T>} A map of entity ids to component instance data.
     */
    mapOf(componentClass) {
        const componentName = componentClass.name;
        const components = this.components;
        if (!(componentName in components)) {
            /** @type {ComponentInstanceMap<T>} */
            let map = {};
            components[componentName] = map;
            this.nameClassMapping[componentName] = componentClass;
            return map;
        } else {
            return components[componentName];
        }
    }

    /** @returns {Set<EntityId>} */
    entityIds() {
        let result = new Set();
        for (let instanceMap of Object.values(this.components)) {
            for(let entityId of Object.keys(instanceMap)) {
                result.add(entityId);
            }
        }
        return result;
    }

    /** @returns {Array<ComponentClass<?>>} */
    componentClasses() {
        return Object.values(this.nameClassMapping);
    }

    reset() {
        const components = this.components;
        /** @type {Set<EntityId>} */
        let entities = new Set();
        for(const componentName of Object.keys(components)) {
            const componentClass = this.nameClassMapping[componentName];
            const instanceMap = components[componentName];
            for(let entityId of Object.keys(instanceMap)) {
                entities.add(Number(entityId));
            }
            this.clearImmediately(componentClass);
        }
        for(let entityId of entities) {
            this.entityComponentChangedCallback(entityId, null, null, true);
        }
        entities.clear();
        this.queries.reset();
        this.components = {};
        this.nextAvailableEntityId = 1;
        this.queue.length = 0;
        this.listeners.length = 0;
    }
}
